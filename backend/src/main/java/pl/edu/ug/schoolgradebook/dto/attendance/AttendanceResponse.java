package pl.edu.ug.schoolgradebook.dto.attendance;

import pl.edu.ug.schoolgradebook.enums.AttendanceStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record AttendanceResponse(
        UUID id,
        UUID teacherId,
        UUID studentId,
        UUID lessonTimeId,
        LocalDate lessonDate,
        AttendanceStatus attendanceStatus,
        Instant createdAt,
        Instant modifiedAt
) {}
