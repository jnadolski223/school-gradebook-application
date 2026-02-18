package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationFullResponse;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationShortResponse;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationStatusRequest;
import pl.edu.ug.schoolgradebook.service.SchoolApplicationService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.SCHOOL_APPLICATIONS)
@RequiredArgsConstructor
public class SchoolApplicationController {
    private final SchoolApplicationService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolApplicationFullResponse>> createSchoolApplication(@RequestBody SchoolApplicationRequest request) {
        SchoolApplicationFullResponse application = service.createSchoolApplication(request);
        URI location = URI.create(ApiPaths.SCHOOL_APPLICATIONS + "/" + application.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School application created successfully", application));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<SchoolApplicationFullResponse>> getSchoolApplicationById(@PathVariable UUID applicationId) {
        SchoolApplicationFullResponse application = service.getSchoolApplicationById(applicationId);
        return ResponseEntity.ok(ApiResponse.ok("School application retrieved successfully", application));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolApplicationShortResponse>>> getAllSchoolApplications() {
        List<SchoolApplicationShortResponse> applications = service.getAllSchoolApplications();
        return ResponseEntity.ok(ApiResponse.ok("School applications retrieved successfully", applications));
    }

    @PatchMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<SchoolApplicationFullResponse>> updateSchoolApplicationStatus(
            @PathVariable UUID applicationId,
            @RequestBody SchoolApplicationStatusRequest request
    ) {
        SchoolApplicationFullResponse application = service.updateSchoolApplicationStatus(applicationId, request.status());
        return ResponseEntity.ok(ApiResponse.ok("Status of school application updated successfully", application));
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> deleteSchoolApplication(@PathVariable UUID applicationId) {
        service.deleteSchoolApplication(applicationId);
        return ResponseEntity.noContent().build();
    }
}
