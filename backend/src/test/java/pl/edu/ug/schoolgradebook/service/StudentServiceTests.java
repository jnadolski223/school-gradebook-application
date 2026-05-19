package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.*;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberRequest;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberResponse;
import pl.edu.ug.schoolgradebook.dto.student.StudentRequest;
import pl.edu.ug.schoolgradebook.dto.student.StudentResponse;
import pl.edu.ug.schoolgradebook.dto.student.StudentUpdateRequest;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.BadRequestException;
import pl.edu.ug.schoolgradebook.repository.SchoolClassRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.StudentRepository;
import pl.edu.ug.schoolgradebook.util.mapper.StudentMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTests {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SchoolMemberRepository schoolMemberRepository;

    @Mock
    private SchoolClassRepository schoolClassRepository;

    @Mock
    private SchoolMemberService schoolMemberService;

    @Mock
    private StudentMapper mapper;

    @InjectMocks
    private StudentService studentService;

    private UUID schoolId;

    private UUID schoolMemberId;
    private SchoolMember schoolMember;

    private UUID parentId;
    private SchoolMember parent;

    private UUID schoolClassId;
    private SchoolClass schoolClass;

    private UUID id;
    private StudentRequest request;
    private Student student;
    private StudentResponse response;

    @BeforeEach
    void setUp() {
        schoolId = UUID.randomUUID();
        schoolMemberId = UUID.randomUUID();
        schoolMember = SchoolMember.builder()
                .userId(schoolMemberId)
                .user(User.builder()
                        .login("john-doe-123")
                        .password("test123")
                        .role(UserRole.STUDENT)
                        .build())
                .school(School.builder().id(schoolId).build())
                .firstName("John")
                .lastName("Doe")
                .build();

        parentId = UUID.randomUUID();
        parent = SchoolMember.builder()
                .userId(parentId)
                .user(User.builder().role(UserRole.PARENT).build())
                .build();

        schoolClassId = UUID.randomUUID();
        schoolClass = SchoolClass.builder().id(schoolClassId).build();

        id = UUID.randomUUID();
        request = new StudentRequest(
                schoolId,
                schoolClassId,
                parentId,
                schoolMember.getUser().getLogin(),
                schoolMember.getUser().getPassword(),
                schoolMember.getFirstName(),
                schoolMember.getLastName()
        );
        student = Student.builder()
                .schoolMemberId(schoolMemberId)
                .schoolMember(schoolMember)
                .parent(parent)
                .schoolClass(schoolClass)
                .build();
        response = new StudentResponse(
                student.getSchoolMemberId(),
                student.getSchoolClass().getId(),
                student.getParent().getUserId(),
                student.getSchoolMember().getSchool().getId(),
                student.getSchoolMember().getUser().getLogin(),
                student.getSchoolMember().getFirstName(),
                student.getSchoolMember().getLastName(),
                student.getSchoolMember().getUser().getRole()
        );
    }

    @Test
    @DisplayName("Should create a new student already assigned to school class")
    void shouldCreateStudentAssignedToSchoolClass() {
        // Given
        SchoolMemberRequest schoolMemberRequest = new SchoolMemberRequest(
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getUser().getPassword(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
        SchoolMemberResponse schoolMemberResponse = new SchoolMemberResponse(
                schoolMember.getUserId(),
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
        when(schoolMemberService.createSchoolMember(schoolMemberRequest)).thenReturn(schoolMemberResponse);
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(schoolMemberRepository.findById(parentId)).thenReturn(Optional.of(parent));
        when(schoolClassRepository.findById(schoolClassId)).thenReturn(Optional.of(schoolClass));
        when(mapper.mapRequestToEntity(schoolMember, parent, schoolClass)).thenReturn(student);
        when(studentRepository.save(student)).thenReturn(student);
        when(mapper.mapEntityToResponse(student)).thenReturn(response);

        // When
        StudentResponse result = studentService.createStudent(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(studentRepository).save(student);
    }

    @Test
    @DisplayName("Should create a new student not assigned to school class")
    void shouldCreateStudentNotAssignedToSchoolClass() {
        // Given
        request = new StudentRequest(
                schoolId,
                null,
                parentId,
                schoolMember.getUser().getLogin(),
                schoolMember.getUser().getPassword(),
                schoolMember.getFirstName(),
                schoolMember.getLastName()
        );
        response = new StudentResponse(
                student.getSchoolMemberId(),
                null,
                student.getParent().getUserId(),
                student.getSchoolMember().getSchool().getId(),
                student.getSchoolMember().getUser().getLogin(),
                student.getSchoolMember().getFirstName(),
                student.getSchoolMember().getLastName(),
                student.getSchoolMember().getUser().getRole()
        );
        SchoolMemberRequest schoolMemberRequest = new SchoolMemberRequest(
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getUser().getPassword(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
        SchoolMemberResponse schoolMemberResponse = new SchoolMemberResponse(
                schoolMember.getUserId(),
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
        when(schoolMemberService.createSchoolMember(schoolMemberRequest)).thenReturn(schoolMemberResponse);
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(schoolMemberRepository.findById(parentId)).thenReturn(Optional.of(parent));
        when(mapper.mapRequestToEntity(schoolMember, parent, null)).thenReturn(student);
        when(studentRepository.save(student)).thenReturn(student);
        when(mapper.mapEntityToResponse(student)).thenReturn(response);

        // When
        StudentResponse result = studentService.createStudent(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(studentRepository).save(student);
    }

    @Test
    @DisplayName("Should throw BadRequestException if parentId is null")
    void shouldThrowExceptionIfParentIdIsMissing() {
        // Given
        request = new StudentRequest(
                schoolId,
                schoolClassId,
                null,
                schoolMember.getUser().getLogin(),
                schoolMember.getUser().getPassword(),
                schoolMember.getFirstName(),
                schoolMember.getLastName()
        );
        SchoolMemberRequest schoolMemberRequest = new SchoolMemberRequest(
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getUser().getPassword(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
        SchoolMemberResponse schoolMemberResponse = new SchoolMemberResponse(
                schoolMember.getUserId(),
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
        when(schoolMemberService.createSchoolMember(schoolMemberRequest)).thenReturn(schoolMemberResponse);
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));

        // When & Then
        assertThrows(BadRequestException.class, () -> studentService.createStudent(request));
    }

    @Test
    @DisplayName("Should throw BadRequestException if parent does not have PARENT role")
    void shouldThrowExceptionIfParentHasInvalidRole() {
        // Given
        parent.getUser().setRole(UserRole.TEACHER);
        SchoolMemberRequest schoolMemberRequest = new SchoolMemberRequest(
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getUser().getPassword(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
        SchoolMemberResponse schoolMemberResponse = new SchoolMemberResponse(
                schoolMember.getUserId(),
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
        when(schoolMemberService.createSchoolMember(schoolMemberRequest)).thenReturn(schoolMemberResponse);
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(schoolMemberRepository.findById(parentId)).thenReturn(Optional.of(parent));

        // When & Then
        assertThrows(BadRequestException.class, () -> studentService.createStudent(request));
    }

    @Test
    @DisplayName("Should return student by ID")
    void shouldReturnStudentById() {
        // Given
        when(studentRepository.findById(id)).thenReturn(Optional.of(student));
        when(mapper.mapEntityToResponse(student)).thenReturn(response);

        // When
        StudentResponse result = studentService.getStudentById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.schoolMemberId()).isEqualTo(schoolMemberId);
        verify(studentRepository).findById(id);
    }

    @Test
    @DisplayName("Should return all students")
    void shouldReturnAllStudents() {
        // Given
        List<Student> students = List.of(student, student);
        when(studentRepository.findAll()).thenReturn(students);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<StudentResponse> results = studentService.getAllStudents();

        // Then
        assertThat(results).hasSize(2);
        verify(studentRepository).findAll();
    }

    @Test
    @DisplayName("Should return all students with given schoolClassId")
    void shouldReturnAllStudentsInSchoolClass() {
        // Given
        List<Student> students = List.of(student, student);
        when(studentRepository.findBySchoolClass_Id(schoolClassId)).thenReturn(students);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<StudentResponse> results = studentService.getAllStudentsBySchoolClass(schoolClassId);

        // Then
        assertThat(results).hasSize(2);
        verify(studentRepository).findBySchoolClass_Id(schoolClassId);
    }

    @Test
    @DisplayName("Should return all student with given parentId")
    void shouldReturnAllStudentsWithGivenParentId() {
        // Given
        List<Student> students = List.of(student, student);
        when(studentRepository.findByParent_UserId(parentId)).thenReturn(students);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<StudentResponse> results = studentService.getAllStudentsByParentId(parentId);

        // Then
        assertThat(results).hasSize(2);
        verify(studentRepository).findByParent_UserId(parentId);
    }

    @Test
    @DisplayName("Should update student's class and parent")
    void shouldUpdateStudentClassAndParent() {
        // Given
        UUID newClassId = UUID.randomUUID();
        UUID newParentId = UUID.randomUUID();
        SchoolClass newSchoolClass = SchoolClass.builder().id(newClassId).build();
        SchoolMember newParent = SchoolMember.builder()
                .userId(newParentId)
                .user(User.builder().role(UserRole.PARENT).build())
                .build();
        StudentUpdateRequest updateRequest = new StudentUpdateRequest(newClassId, newParentId);
        when(studentRepository.findById(id)).thenReturn(Optional.of(student));
        when(schoolClassRepository.findById(newClassId)).thenReturn(Optional.of(newSchoolClass));
        when(schoolMemberRepository.findById(newParentId)).thenReturn(Optional.of(newParent));
        when(mapper.mapEntityToResponse(student)).thenReturn(response);

        // When
        StudentResponse result = studentService.updateStudent(id, updateRequest);

        // Then
        assertThat(student.getSchoolClass()).isEqualTo(newSchoolClass);
        assertThat(student.getParent()).isEqualTo(newParent);
        assertThat(result).isEqualTo(response);
        verify(schoolClassRepository).findById(newClassId);
        verify(schoolMemberRepository).findById(newParentId);
    }

    @Test
    @DisplayName("Should remove school class from student when schoolClassId is null")
    void shouldRemoveSchoolClassWhenIdIsNull() {
        // Given
        StudentUpdateRequest updateRequest = new StudentUpdateRequest(null, parentId);
        when(studentRepository.findById(id)).thenReturn(Optional.of(student));
        when(mapper.mapEntityToResponse(student)).thenReturn(response);

        // When
        studentService.updateStudent(id, updateRequest);

        // Then
        assertThat(student.getSchoolClass()).isNull();
        verify(schoolMemberRepository, never()).findById(any());
    }

    @Test
    @DisplayName("Should not update class or parent if they are the same as current")
    void shouldNotUpdateIfDataIsSame() {
        // Given
        StudentUpdateRequest updateRequest = new StudentUpdateRequest(schoolClassId, parentId);
        when(studentRepository.findById(id)).thenReturn(Optional.of(student));
        when(mapper.mapEntityToResponse(student)).thenReturn(response);

        // When
        studentService.updateStudent(id, updateRequest);

        // Then
        verify(schoolClassRepository, never()).findById(any());
        verify(schoolMemberRepository, never()).findById(any());
    }

    @Test
    @DisplayName("Should update only school class when parentId is the same")
    void shouldUpdateOnlyClass() {
        // Given
        UUID newClassId = UUID.randomUUID();
        SchoolClass newSchoolClass = SchoolClass.builder().id(newClassId).build();
        StudentUpdateRequest updateRequest = new StudentUpdateRequest(newClassId, parentId);
        when(studentRepository.findById(id)).thenReturn(Optional.of(student));
        when(schoolClassRepository.findById(newClassId)).thenReturn(Optional.of(newSchoolClass));
        when(mapper.mapEntityToResponse(student)).thenReturn(response);

        // When
        studentService.updateStudent(id, updateRequest);

        // Then
        assertThat(student.getSchoolClass()).isEqualTo(newSchoolClass);
        verify(schoolClassRepository).findById(newClassId);
        verify(schoolMemberRepository, never()).findById(any());
    }

    @Test
    @DisplayName("Should delete student by ID")
    void shouldDeleteStudentById() {
        // Given
        when(studentRepository.findById(id)).thenReturn(Optional.of(student));

        // When
        studentService.deleteStudent(id);

        // Then
        verify(studentRepository).delete(student);
    }
}
