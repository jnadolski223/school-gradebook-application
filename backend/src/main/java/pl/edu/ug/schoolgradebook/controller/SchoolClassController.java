package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassCreateRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassResponse;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassUpdateRequest;
import pl.edu.ug.schoolgradebook.service.SchoolClassService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.SCHOOL_CLASSES)
@RequiredArgsConstructor
public class SchoolClassController {

    private final SchoolClassService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolClassResponse>> create(@RequestBody SchoolClassCreateRequest request) {
        SchoolClassResponse schoolClass = service.create(request);
        URI location = URI.create(ApiPaths.SCHOOL_CLASSES + "/" + schoolClass.id());

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School class created successfully", schoolClass));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolClassResponse>>> getAll(@RequestParam(required = false) UUID schoolId) {
        List<SchoolClassResponse> classes = service.getAll(schoolId);
        String message;
        if (schoolId != null) {
            message = "All classes in school with ID " + schoolId + " fetched successfully";
        } else {
            message = "All school classes fetched successfully";
        }

        return ResponseEntity.ok(ApiResponse.ok(message, classes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolClassResponse>> getById(@PathVariable UUID id) {
        SchoolClassResponse schoolClass = service.getById(id);
        return ResponseEntity.ok(ApiResponse.ok("School class fetched successfully", schoolClass));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolClassResponse>> update(@PathVariable UUID id, @RequestBody SchoolClassUpdateRequest request) {
        SchoolClassResponse schoolClass = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok("School class updated successfully", schoolClass));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
