package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.Grade;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.grade.GradeRequest;
import pl.edu.ug.schoolgradebook.dto.grade.GradeResponse;
import pl.edu.ug.schoolgradebook.enums.GradeType;
import pl.edu.ug.schoolgradebook.enums.GradeValue;
import pl.edu.ug.schoolgradebook.repository.GradeRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.StudentRepository;
import pl.edu.ug.schoolgradebook.repository.SubjectRepository;
import pl.edu.ug.schoolgradebook.util.mapper.GradeMapper;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GradeServiceTests {

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SchoolMemberRepository schoolMemberRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private GradeMapper mapper;

    @InjectMocks
    private GradeService service;

    private UUID studentId;
    private Student student;

    private UUID schoolMemberId;
    private SchoolMember schoolMember;

    private UUID subjectId;
    private Subject subject;

    private UUID id;
    private GradeRequest request;
    private Grade grade;
    private GradeResponse response;

    @BeforeEach
    void setUp() {
        studentId = UUID.randomUUID();
        student = Student.builder().schoolMemberId(studentId).build();

        schoolMemberId = UUID.randomUUID();
        schoolMember = SchoolMember.builder().userId(schoolMemberId).build();

        subjectId = UUID.randomUUID();
        subject = Subject.builder().id(subjectId).build();

        id = UUID.randomUUID();
        request = new GradeRequest(
                studentId,
                schoolMemberId,
                subjectId,
                GradeValue.FIVE,
                GradeType.REGULAR_SEMESTER_1,
                10,
                true,
                "Lorem ipsum dolor sit."
        );
        grade = Grade.builder()
                .id(id)
                .student(student)
                .teacher(schoolMember)
                .subject(subject)
                .gradeValue(request.gradeValue())
                .gradeType(request.gradeType())
                .weight(request.weight())
                .countToAverage(request.countToAverage())
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .description(request.description())
                .build();
        response = new GradeResponse(
                grade.getId(),
                grade.getStudent().getSchoolMemberId(),
                grade.getTeacher().getUserId(),
                grade.getSubject().getId(),
                grade.getGradeValue(),
                grade.getGradeType(),
                grade.getWeight(),
                grade.isCountToAverage(),
                grade.getCreatedAt(),
                grade.getModifiedAt(),
                grade.getDescription()
        );
    }

    @Test
    @DisplayName("Should create a new grade")
    void shouldCreateGrade() {
        // Given
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(mapper.mapRequestToEntity(request, student, schoolMember, subject)).thenReturn(grade);
        when(gradeRepository.save(grade)).thenReturn(grade);
        when(mapper.mapEntityToResponse(grade)).thenReturn(response);

        // When
        GradeResponse result = service.createGrade(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(gradeRepository).save(grade);
    }

    @Test
    @DisplayName("Should return grade by ID")
    void shouldReturnGradeById() {
        // Given
        when(gradeRepository.findById(id)).thenReturn(Optional.of(grade));
        when(mapper.mapEntityToResponse(grade)).thenReturn(response);

        // When
        GradeResponse result = service.getGradeById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(gradeRepository).findById(id);
    }

    @Test
    @DisplayName("Should return all grades")
    void shouldReturnAllGrades() {
        // Given
        List<Grade> grades = List.of(grade, grade);
        when(gradeRepository.findAll()).thenReturn(grades);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<GradeResponse> results = service.getAllGrades();

        // Then
        assertThat(results).hasSize(2);
        verify(gradeRepository).findAll();
    }

    @Test
    @DisplayName("Should return all grades for given studentId")
    void shouldReturnAllGradesByStudentId() {
        // Given
        List<Grade> grades = List.of(grade, grade);
        when(gradeRepository.findByStudent_SchoolMemberId(studentId)).thenReturn(grades);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<GradeResponse> results = service.getAllGradesByStudentId(studentId);

        // Then
        assertThat(results).hasSize(2);
        verify(gradeRepository).findByStudent_SchoolMemberId(studentId);
    }

    @Test
    @DisplayName("Should update grade data")
    void shouldUpdateGrade() {
        // Given
        request = new GradeRequest(
                studentId,
                schoolMemberId,
                subjectId,
                GradeValue.THREE_PLUS,
                GradeType.REGULAR_SEMESTER_2,
                7,
                true,
                "Math quiz"
        );
        when(gradeRepository.findById(id)).thenReturn(Optional.of(grade));
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(mapper.mapEntityToResponse(grade)).thenReturn(response);

        // When
        GradeResponse result = service.updateGrade(id, request);

        // Then
        assertThat(grade.getGradeValue()).isEqualTo(request.gradeValue());
        assertThat(grade.getGradeType()).isEqualTo(request.gradeType());
        assertThat(grade.getWeight()).isEqualTo(request.weight());
        assertThat(grade.getDescription()).isEqualTo(request.description());
    }

    @Test
    @DisplayName("Should delete grade by ID")
    void shouldDeleteGradeById() {
        // Given
        when(gradeRepository.findById(id)).thenReturn(Optional.of(grade));

        // When
        service.deleteGrade(id);

        // Then
        verify(gradeRepository).delete(grade);
    }
}
