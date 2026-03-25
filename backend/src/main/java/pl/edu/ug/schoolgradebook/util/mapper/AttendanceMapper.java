package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.Attendance;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceRequest;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceResponse;

@Component
public class AttendanceMapper {
    public Attendance mapRequestToEntity(
            AttendanceRequest request,
            SchoolMember teacher,
            Student student,
            LessonTime lessonTime
    ) {
        return Attendance.builder()
                .teacher(teacher)
                .student(student)
                .lessonTime(lessonTime)
                .lessonDate(request.lessonDate())
                .attendanceStatus(request.attendanceStatus())
                .build();
    }

    public AttendanceResponse mapEntityToResponse(Attendance attendance) {
        return new AttendanceResponse(
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
}
