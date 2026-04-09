package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.*;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceRequest;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceResponse;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceUpdateRequest;
import pl.edu.ug.schoolgradebook.enums.AttendanceStatus;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.AttendanceRepository;
import pl.edu.ug.schoolgradebook.repository.LessonTimeRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.StudentRepository;
import pl.edu.ug.schoolgradebook.util.mapper.AttendanceMapper;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AttendanceServiceTests {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private SchoolMemberRepository schoolMemberRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private LessonTimeRepository lessonTimeRepository;

    @Mock
    private AttendanceMapper mapper;

    @InjectMocks
    private AttendanceService service;

    private UUID schoolMemberId;
    private SchoolMember schoolMember;

    private UUID studentId;
    private Student student;

    private UUID lessonTimeId;
    private LessonTime lessonTime;

    private UUID id;
    private AttendanceRequest request;
    private Attendance attendance;
    private AttendanceResponse response;

    @BeforeEach
    void setUp() {
        schoolMemberId = UUID.randomUUID();
        schoolMember = SchoolMember.builder().userId(schoolMemberId).build();

        studentId = UUID.randomUUID();
        student = Student.builder().schoolMemberId(studentId).build();

        lessonTimeId = UUID.randomUUID();
        lessonTime = LessonTime.builder().id(lessonTimeId).build();

        id = UUID.randomUUID();
        request = new AttendanceRequest(
                schoolMemberId,
                studentId,
                lessonTimeId,
                LocalDate.of(2026, 4, 9),
                AttendanceStatus.PRESENT
        );
        attendance = Attendance.builder()
                .id(id)
                .teacher(schoolMember)
                .student(student)
                .lessonTime(lessonTime)
                .lessonDate(request.lessonDate())
                .attendanceStatus(request.attendanceStatus())
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .build();
        response = new AttendanceResponse(
                attendance.getId(),
                attendance.getTeacher().getUserId(),
                attendance.getStudent().getSchoolMemberId(),
                attendance.getLessonTime().getId(),
                attendance.getLessonDate(),
                attendance.getAttendanceStatus(),
                attendance.getCreatedAt(),
                attendance.getModifiedAt()
        );
    }

    @Test
    @DisplayName("Should create a new attendance")
    void shouldCreateAttendance() {
        // Given
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(lessonTimeRepository.findById(lessonTimeId)).thenReturn(Optional.of(lessonTime));
        when(attendanceRepository.findByStudentAndLessonTimeAndLessonDate(student, lessonTime, request.lessonDate())).thenReturn(Optional.empty());
        when(mapper.mapRequestToEntity(request, schoolMember, student, lessonTime)).thenReturn(attendance);
        when(attendanceRepository.save(attendance)).thenReturn(attendance);
        when(mapper.mapEntityToResponse(attendance)).thenReturn(response);

        // When
        AttendanceResponse result = service.createAttendance(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(attendanceRepository).save(attendance);
    }

    @Test
    @DisplayName("Should throw ConflictException if student has attendance on given day and lesson time")
    void shouldThrowExceptionIfStudentHasAttendanceOnGivenDayAndLessonTime() {
        // Given
        Attendance fakeAttendance = Attendance.builder().id(UUID.randomUUID()).build();
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(lessonTimeRepository.findById(lessonTimeId)).thenReturn(Optional.of(lessonTime));
        when(attendanceRepository.findByStudentAndLessonTimeAndLessonDate(student, lessonTime, request.lessonDate())).thenReturn(Optional.of(fakeAttendance));

        // When & Then
        assertThrows(ConflictException.class, () -> service.createAttendance(request));
    }

    @Test
    @DisplayName("Should return attendance by ID")
    void shouldReturnAttendanceById() {
        // Given
        when(attendanceRepository.findById(id)).thenReturn(Optional.of(attendance));
        when(mapper.mapEntityToResponse(attendance)).thenReturn(response);

        // When
        AttendanceResponse result = service.getAttendanceById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(attendanceRepository).findById(id);
    }

    @Test
    @DisplayName("Should return all attendances")
    void shouldReturnAllAttendances() {
        // Given
        List<Attendance> attendances = List.of(attendance, attendance);
        when(attendanceRepository.findAll()).thenReturn(attendances);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<AttendanceResponse> results = service.getAllAttendances();

        // Then
        assertThat(results).hasSize(2);
        verify(attendanceRepository).findAll();
    }

    @Test
    @DisplayName("Should return all attendances for given studentId")
    void shouldReturnAllAttendancesByStudentId() {
        // Given
        List<Attendance> attendances = List.of(attendance, attendance);
        when(attendanceRepository.findByStudent_SchoolMemberId(studentId)).thenReturn(attendances);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<AttendanceResponse> results = service.getAllAttendancesByStudentId(studentId);

        // Then
        assertThat(results).hasSize(2);
        verify(attendanceRepository).findByStudent_SchoolMemberId(studentId);
    }

    @Test
    @DisplayName("Should update attendance teacherId or status")
    void shouldUpdateAttendanceTeacherIdOrStatus() {
        // Given
        UUID fakeTeacherId = UUID.randomUUID();
        SchoolMember fakeTeacher = SchoolMember.builder().userId(fakeTeacherId).build();
        AttendanceUpdateRequest updateRequest = new AttendanceUpdateRequest(fakeTeacherId, AttendanceStatus.ABSENT);
        when(attendanceRepository.findById(id)).thenReturn(Optional.of(attendance));
        when(schoolMemberRepository.findById(fakeTeacherId)).thenReturn(Optional.of(fakeTeacher));
        when(mapper.mapEntityToResponse(attendance)).thenReturn(response);

        // When
        service.updateAttendance(id, updateRequest);

        // Then
        assertThat(attendance.getTeacher().getUserId()).isEqualTo(fakeTeacherId);
        assertThat(attendance.getAttendanceStatus()).isEqualTo(updateRequest.attendanceStatus());
    }

    @Test
    @DisplayName("Should delete attendance by ID")
    void shouldDeleteAttendanceById() {
        // Given
        when(attendanceRepository.findById(id)).thenReturn(Optional.of(attendance));

        // When
        service.deleteAttendance(id);

        // Then
        verify(attendanceRepository).delete(attendance);
    }
}
