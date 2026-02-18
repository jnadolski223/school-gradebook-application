package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequest;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequestName;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectResponse;
import pl.edu.ug.schoolgradebook.service.SubjectService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.SUBJECTS)
@RequiredArgsConstructor
public class SubjectController {
    private final SubjectService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(@RequestBody SubjectRequest request) {
        SubjectResponse subject = service.createSubject(request);
        URI location = URI.create(ApiPaths.SUBJECTS + "/" + subject.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("Subject created successfully", subject));
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectById(@PathVariable UUID subjectId) {
        SubjectResponse subject = service.getSubjectById(subjectId);
        return ResponseEntity.ok(ApiResponse.ok("Subject retrieved successfully", subject));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjectBySchoolId(@RequestParam UUID schoolId) {
        List<SubjectResponse> subjects = service.getAllSubjectsBySchool(schoolId);
        String message = "All subjects for school with ID " + schoolId.toString() + " retrieved successfully";
        return ResponseEntity.ok(ApiResponse.ok(message, subjects));
    }

    @PatchMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubjectName(
            @PathVariable UUID subjectId,
            @RequestBody SubjectRequestName request
    ) {
        SubjectResponse subject = service.updateSubjectName(subjectId, request);
        return ResponseEntity.ok(ApiResponse.ok("Subject updated successfully", subject));
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<Void> deleteSubject(@PathVariable UUID subjectId) {
        service.deleteSubject(subjectId);
        return ResponseEntity.noContent().build();
    }
}
