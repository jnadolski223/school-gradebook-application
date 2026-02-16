package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolFullResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.school.SchoolShortResponse;
import pl.edu.ug.schoolgradebook.service.SchoolService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.SCHOOLS)
@RequiredArgsConstructor
public class SchoolController {
    private final SchoolService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolFullResponse>> createSchool(@RequestBody SchoolRequest request) {
        SchoolFullResponse school = service.createSchool(request);
        URI location = URI.create(ApiPaths.SCHOOLS + "/" + school.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School created successfully", school));
    }

    @GetMapping("/{schoolId}")
    public ResponseEntity<ApiResponse<SchoolFullResponse>> getSchoolById(@PathVariable UUID schoolId) {
        SchoolFullResponse school = service.getSchoolById(schoolId);
        return ResponseEntity.ok(ApiResponse.ok("School retrieved successfully", school));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolShortResponse>>> getAllSchools() {
        List<SchoolShortResponse> schools = service.getAllSchools();
        return ResponseEntity.ok(ApiResponse.ok("All schools retrieved successfully", schools));
    }

    @PutMapping("/{schoolId}")
    public ResponseEntity<ApiResponse<SchoolFullResponse>> updateSchool(
            @PathVariable UUID schoolId,
            @RequestBody SchoolRequest request
    ) {
        SchoolFullResponse school = service.updateSchool(schoolId, request);
        return ResponseEntity.ok(ApiResponse.ok("School updated successfully", school));
    }

    @DeleteMapping("/{schoolId}")
    public ResponseEntity<Void> deleteSchool(@PathVariable UUID schoolId) {
        service.deleteSchool(schoolId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{schoolId}/activate")
    public ResponseEntity<Void> activateSchool(@PathVariable UUID schoolId) {
        service.activateSchool(schoolId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{schoolId}/deactivate")
    public ResponseEntity<Void> deactivateSchool(@PathVariable UUID schoolId) {
        service.deactivateSchool(schoolId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{schoolId}/is-school-admin-created")
    public ResponseEntity<ApiResponse<Boolean>> isSchoolAdminCreated(@PathVariable UUID schoolId) {
        boolean isCreated = service.isSchoolAdminCreated(schoolId);
        if (isCreated) {
            return ResponseEntity.ok(ApiResponse.ok("School administrator has already been created", true));
        } else {
            return ResponseEntity.ok(ApiResponse.ok("School administrator has not been created yet", false));
        }
    }
}
