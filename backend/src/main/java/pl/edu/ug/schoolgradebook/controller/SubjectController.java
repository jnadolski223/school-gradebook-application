package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectCreateRequest;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectResponse;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectUpdateRequest;
import pl.edu.ug.schoolgradebook.service.SubjectService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.SUBJECTS)
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> create(@RequestBody SubjectCreateRequest request) {
        SubjectResponse subject = service.create(request);
        URI location = URI.create(ApiPaths.SUBJECTS + "/" + subject.id());

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("Subject created successfully", subject));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllBySchoolId(@RequestParam UUID schoolId) {
        List<SubjectResponse> subjects = service.getAllBySchool(schoolId);
        String message = "All subjects for school with ID " + schoolId.toString() + " fetched successfully";
        return ResponseEntity.ok(ApiResponse.ok(message, subjects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getById(@PathVariable UUID id) {
        SubjectResponse subject = service.getById(id);
        return ResponseEntity.ok(ApiResponse.ok("Subject fetched successfully", subject));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> update(@PathVariable UUID id, @RequestBody SubjectUpdateRequest request) {
        SubjectResponse subject = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Subject updated successfully", subject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
