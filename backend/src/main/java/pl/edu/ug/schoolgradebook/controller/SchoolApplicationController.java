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

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.SCHOOL_APPLICATIONS)
@RequiredArgsConstructor
public class SchoolApplicationController {
    private final SchoolApplicationService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolApplicationFullResponse>> createApplication(@RequestBody SchoolApplicationRequest request) {
        SchoolApplicationFullResponse application = service.createApplication(request);
        URI location = URI.create(ApiPaths.SCHOOL_APPLICATIONS + "/" + application.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School application created successfully", application));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<SchoolApplicationFullResponse>> getApplicationById(@PathVariable UUID applicationId) {
        SchoolApplicationFullResponse application = service.getApplicationById(applicationId);
        return ResponseEntity.ok(ApiResponse.ok("School application retrieved successfully", application));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolApplicationShortResponse>>> getAllApplications() {
        List<SchoolApplicationShortResponse> applications = service.getAllApplications();
        return ResponseEntity.ok(ApiResponse.ok("School applications retrieved successfully", applications));
    }

    @PatchMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<SchoolApplicationFullResponse>> updateApplicationStatus(
            @PathVariable UUID applicationId,
            @RequestBody SchoolApplicationStatusRequest request
    ) {
        SchoolApplicationFullResponse application = service.updateApplicationStatus(applicationId, request.status());
        return ResponseEntity.ok(ApiResponse.ok("Status of school application updated successfully", application));
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> deleteApplication(@PathVariable UUID applicationId) {
        service.deleteApplication(applicationId);
        return ResponseEntity.noContent().build();
    }
}
