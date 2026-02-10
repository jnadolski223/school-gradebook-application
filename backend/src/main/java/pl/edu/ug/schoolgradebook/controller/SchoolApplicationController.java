package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.*;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationResponseFull;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationResponseShort;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.UpdateSchoolApplicationStatusRequest;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;
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
    public ResponseEntity<ApiResponse<SchoolApplicationResponseFull>> createApplication(
            @RequestBody SchoolApplicationRequest request
    ) {
        SchoolApplicationResponseFull application = service.createApplication(request);
        URI location = URI.create(ApiPaths.SCHOOL_APPLICATIONS + "/" + application.id());

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School application created successfully", application));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolApplicationResponseShort>>> getApplications(
            @RequestParam(required = false) SchoolApplicationStatus status
    ) {
        List<SchoolApplicationResponseShort> applications;
        String message;

        if (status != null) {
            applications = service.getAllApplicationsByStatus(status);
            message = "All school applications with " + status + " status fetched successfully";
        } else {
            applications = service.getAllApplications();
            message = "All school applications fetched successfully";
        }

        return ResponseEntity.ok(ApiResponse.ok(message, applications));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolApplicationResponseFull>> getApplicationById(@PathVariable UUID id) {
        SchoolApplicationResponseFull application = service.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.ok("School application fetched successfully", application));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolApplicationResponseFull>> updateApplicationStatus(
            @PathVariable UUID id, @RequestBody UpdateSchoolApplicationStatusRequest request
    ) {
        SchoolApplicationResponseFull application = service.updateApplicationStatus(id, request.status());
        return ResponseEntity.ok(ApiResponse.ok("School application status updated successfully", application));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable UUID id) {
        service.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
