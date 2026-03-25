package pl.edu.ug.schoolgradebook.dto.attendance;

import pl.edu.ug.schoolgradebook.enums.AttendanceStatus;

import java.util.UUID;

public record AttendanceUpdateRequest(
        UUID teacherId,
        AttendanceStatus attendanceStatus
) {}
