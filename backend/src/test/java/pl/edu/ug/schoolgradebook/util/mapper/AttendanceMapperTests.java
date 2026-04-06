package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.Attendance;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceRequest;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceResponse;
import pl.edu.ug.schoolgradebook.enums.AttendanceStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class AttendanceMapperTests {

    private final AttendanceMapper mapper = new AttendanceMapper();

    @Test
    @DisplayName("Should correctly map AttendanceRequest DTO to Attendance entity")
    void shouldMapRequestToEntity() {
        SchoolMember teacher = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        Student student = Student.builder()
                .schoolMemberId(UUID.randomUUID())
                .build();

        LessonTime lessonTime = LessonTime.builder()
                .id(UUID.randomUUID())
                .build();

        AttendanceRequest request = new AttendanceRequest(
                teacher.getUserId(),
                student.getSchoolMemberId(),
                lessonTime.getId(),
                LocalDate.of(2026, 1, 1),
                AttendanceStatus.PRESENT
        );

        Attendance attendance = mapper.mapRequestToEntity(request, teacher, student, lessonTime);

        assertThat(attendance).isNotNull();
        assertThat(attendance.getId()).isNull();
        assertThat(attendance.getTeacher()).isEqualTo(teacher);
        assertThat(attendance.getStudent()).isEqualTo(student);
        assertThat(attendance.getLessonTime()).isEqualTo(lessonTime);
        assertThat(attendance.getLessonDate()).isEqualTo(request.lessonDate());
        assertThat(attendance.getAttendanceStatus()).isEqualTo(request.attendanceStatus());
        assertThat(attendance.getCreatedAt()).isNull();
        assertThat(attendance.getModifiedAt()).isNull();
    }

    @Test
    @DisplayName("Should correctly map Attendance entity to AttendanceResponse DTO")
    void shouldMapEntityToResponse() {
        SchoolMember teacher = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        Student student = Student.builder()
                .schoolMemberId(UUID.randomUUID())
                .build();

        LessonTime lessonTime = LessonTime.builder()
                .id(UUID.randomUUID())
                .build();

        Attendance attendance = Attendance.builder()
                .id(UUID.randomUUID())
                .teacher(teacher)
                .student(student)
                .lessonTime(lessonTime)
                .lessonDate(LocalDate.of(2026, 1, 1))
                .attendanceStatus(AttendanceStatus.PRESENT)
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .build();

        AttendanceResponse response = mapper.mapEntityToResponse(attendance);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(attendance.getId());
        assertThat(response.teacherId()).isEqualTo(attendance.getTeacher().getUserId());
        assertThat(response.studentId()).isEqualTo(attendance.getStudent().getSchoolMemberId());
        assertThat(response.lessonTimeId()).isEqualTo(attendance.getLessonTime().getId());
        assertThat(response.lessonDate()).isEqualTo(attendance.getLessonDate());
        assertThat(response.attendanceStatus()).isEqualTo(attendance.getAttendanceStatus());
        assertThat(response.createdAt()).isEqualTo(attendance.getCreatedAt());
        assertThat(response.modifiedAt()).isEqualTo(attendance.getModifiedAt());
    }
}
