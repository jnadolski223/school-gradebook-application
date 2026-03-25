package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceRequest;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceResponse;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceUpdateRequest;
import pl.edu.ug.schoolgradebook.service.AttendanceService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.ATTENDANCES)
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService service;

    @PostMapping
    public ResponseEntity<ApiResponse<AttendanceResponse>> createAttendance(@RequestBody AttendanceRequest request) {
        AttendanceResponse attendance = service.createAttendance(request);
        URI location = URI.create(ApiPaths.ATTENDANCES + "/" + attendance.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("Attendance created successfully", attendance));
    }

    @GetMapping("/{attendanceId}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceById(@PathVariable UUID attendanceId) {
        AttendanceResponse attendance = service.getAttendanceById(attendanceId);
        return ResponseEntity.ok(ApiResponse.ok("Attendance retrieved successfully", attendance));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAllAttendances(@RequestParam(required = false) UUID studentId) {
        List<AttendanceResponse> attendances;
        String message;
        if (studentId != null) {
            attendances = service.getAllAttendancesByStudentId(studentId);
            message = "All attendances for student with ID " + studentId + " retrieved successfully";
        } else {
            attendances = service.getAllAttendances();
            message = "All attendances retrieved successfully";
        }
        return ResponseEntity.ok(ApiResponse.ok(message, attendances));
    }

    @PatchMapping("/{attendanceId}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> updateAttendance(
            @PathVariable UUID attendanceId,
            @RequestBody AttendanceUpdateRequest request
    ) {
        AttendanceResponse attendance = service.updateAttendance(attendanceId, request);
        return ResponseEntity.ok(ApiResponse.ok("Attendance updated successfully", attendance));
    }

    @DeleteMapping("/{attendanceId}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable UUID attendanceId) {
        service.deleteAttendance(attendanceId);
        return ResponseEntity.noContent().build();
    }
}
