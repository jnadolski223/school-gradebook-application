package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.grade.GradeRequest;
import pl.edu.ug.schoolgradebook.dto.grade.GradeResponse;
import pl.edu.ug.schoolgradebook.service.GradeService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.GRADES)
@RequiredArgsConstructor
public class GradeController {
    private final GradeService service;

    @PostMapping
    public ResponseEntity<ApiResponse<GradeResponse>> createGrade(@RequestBody GradeRequest request) {
        GradeResponse grade = service.createGrade(request);
        URI location = URI.create(ApiPaths.GRADES + "/" + grade.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("Grade created successfully", grade));
    }

    @GetMapping("/{gradeId}")
    public ResponseEntity<ApiResponse<GradeResponse>> getGradeById(@PathVariable UUID gradeId) {
        GradeResponse grade = service.getGradeById(gradeId);
        return ResponseEntity.ok(ApiResponse.ok("Grade retrieved successfully", grade));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getAllGrades(@RequestParam(required = false) UUID studentId) {
        List<GradeResponse> grades;
        String message;
        if (studentId != null) {
            grades = service.getAllGradesByStudentId(studentId);
            message = "All grades for student with ID " + studentId + " retrieved successfully";
        } else {
            grades = service.getAllGrades();
            message = "All grades retrieved successfully";
        }
        return ResponseEntity.ok(ApiResponse.ok(message, grades));
    }

    @PutMapping("/{gradeId}")
    public ResponseEntity<ApiResponse<GradeResponse>> updateGrade(
            @PathVariable UUID gradeId,
            @RequestBody GradeRequest request
    ) {
        GradeResponse grade = service.updateGrade(gradeId, request);
        return ResponseEntity.ok(ApiResponse.ok("Grade updated successfully", grade));
    }

    @DeleteMapping("/{gradeId}")
    public ResponseEntity<Void> deleteGrade(@PathVariable UUID gradeId) {
        service.deleteGrade(gradeId);
        return ResponseEntity.noContent().build();
    }
}
