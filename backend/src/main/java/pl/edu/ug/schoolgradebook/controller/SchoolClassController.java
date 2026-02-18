package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassResponse;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassUpdateRequest;
import pl.edu.ug.schoolgradebook.service.SchoolClassService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.SCHOOL_CLASSES)
@RequiredArgsConstructor
public class SchoolClassController {
    private final SchoolClassService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolClassResponse>> createSchoolClass(@RequestBody SchoolClassRequest request) {
        SchoolClassResponse schoolClass = service.createSchoolClass(request);
        URI location = URI.create(ApiPaths.SCHOOL_CLASSES + "/" + schoolClass.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School class created successfully", schoolClass));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolClassResponse>>> getAllSchoolClasses(@RequestParam(required = false) UUID schoolId) {
        List<SchoolClassResponse> classes;
        String message;
        if (schoolId == null) {
            classes = service.getAllSchoolClasses();
            message = "All school classes retrieved successfully";
        } else {
            classes = service.getAllSchoolClassesBySchoolId(schoolId);
            message = "All classes in school with ID " + schoolId + " retrieved successfully";
        }
        return ResponseEntity.ok(ApiResponse.ok(message, classes));
    }

    @GetMapping("/{schoolClassId}")
    public ResponseEntity<ApiResponse<SchoolClassResponse>> getSchoolClassById(@PathVariable UUID schoolClassId) {
        SchoolClassResponse schoolClass = service.getSchoolClassById(schoolClassId);
        return ResponseEntity.ok(ApiResponse.ok("School class retrieved successfully", schoolClass));
    }

    @PatchMapping("/{schoolClassId}")
    public ResponseEntity<ApiResponse<SchoolClassResponse>> updateSchoolClass(
            @PathVariable UUID schoolClassId,
            @RequestBody SchoolClassUpdateRequest request
    ) {
        SchoolClassResponse schoolClass = service.updateSchoolClass(schoolClassId, request);
        return ResponseEntity.ok(ApiResponse.ok("School class updated successfully", schoolClass));
    }

    @DeleteMapping("/{schoolClassId}")
    public ResponseEntity<Void> deleteSchoolClass(@PathVariable UUID schoolClassId) {
        service.deleteSchoolClass(schoolClassId);
        return ResponseEntity.noContent().build();
    }
}
