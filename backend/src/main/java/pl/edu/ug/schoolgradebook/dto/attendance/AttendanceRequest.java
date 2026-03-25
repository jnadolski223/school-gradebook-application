package pl.edu.ug.schoolgradebook.dto.attendance;

import pl.edu.ug.schoolgradebook.enums.AttendanceStatus;

import java.time.LocalDate;
import java.util.UUID;

public record AttendanceRequest(
        UUID teacherId,
        UUID studentId,
        UUID lessonTimeId,
        LocalDate lessonDate,
        AttendanceStatus attendanceStatus
) {}
