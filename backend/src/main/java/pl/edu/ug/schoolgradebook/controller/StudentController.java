package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.student.StudentRequest;
import pl.edu.ug.schoolgradebook.dto.student.StudentResponse;
import pl.edu.ug.schoolgradebook.dto.student.StudentUpdateRequest;
import pl.edu.ug.schoolgradebook.service.StudentService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.STUDENTS)
@RequiredArgsConstructor
public class StudentController {
    private final StudentService service;

    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@RequestBody StudentRequest request) {
        StudentResponse student = service.createStudent(request);
        URI location = URI.create(ApiPaths.STUDENTS + "/" + student.schoolMemberId());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("Student created successfully", student));
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable UUID studentId) {
        StudentResponse student = service.getStudentById(studentId);
        return ResponseEntity.ok(ApiResponse.ok("Student retrieved successfully", student));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents(
            @RequestParam(required = false) UUID schoolClassId,
            @RequestParam(required = false) UUID parentId
    ) {
        List<StudentResponse> students;
        String message;
        if (schoolClassId != null) {
            students = service.getAllStudentsBySchoolClass(schoolClassId);
            message = "All students from school class with ID " + schoolClassId + " retrieved successfully";
        } else if (parentId != null) {
            students = service.getAllStudentsByParentId(parentId);
            message = "All students for parent with ID " + parentId + " retrieved successfully";
        } else {
            students = service.getAllStudents();
            message = "All students retrieved successfully";
        }
        return ResponseEntity.ok(ApiResponse.ok(message, students));
    }

    @PatchMapping("/{studentId}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable UUID studentId,
            @RequestBody StudentUpdateRequest request
    ) {
        StudentResponse student = service.updateStudent(studentId, request);
        return ResponseEntity.ok(ApiResponse.ok("Student updated successfully", student));
    }

    @DeleteMapping("/{studentId}")
    public ResponseEntity<Void> deleteStudent(@PathVariable UUID studentId) {
        service.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }
}
