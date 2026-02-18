package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonRequest;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonResponse;
import pl.edu.ug.schoolgradebook.service.LessonService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.LESSONS)
@RequiredArgsConstructor
public class LessonController {
    private final LessonService service;

    @PostMapping
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(@RequestBody LessonRequest request) {
        LessonResponse lesson = service.createLesson(request);
        URI location = URI.create(ApiPaths.LESSONS + "/" + lesson.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("Lesson created successfully", lesson));
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<LessonResponse>> getLessonById(@PathVariable UUID lessonId) {
        LessonResponse lesson = service.getLessonById(lessonId);
        return ResponseEntity.ok(ApiResponse.ok("Lesson retrieved successfully", lesson));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getAllLessons(
            @RequestParam(required = false) UUID schoolClassId,
            @RequestParam(required = false) UUID teacherId
    ) {
        List<LessonResponse> lessons;
        String message;
        if (schoolClassId != null) {
            lessons = service.getAllLessonsBySchoolClassId(schoolClassId);
            message = "All lessons for school class with ID " + schoolClassId + " retrieved successfully";
        } else if (teacherId != null) {
            lessons = service.getAllLessonsByTeacherId(teacherId);
            message = "All lessons for teacher with ID " + teacherId + " retrieved successfully";
        } else {
            lessons = service.getAllLessons();
            message = "All lessons retrieved successfully";
        }
        return ResponseEntity.ok(ApiResponse.ok(message, lessons));
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @PathVariable UUID lessonId,
            @RequestBody LessonRequest request
    ) {
        LessonResponse lesson = service.updateLesson(lessonId, request);
        return ResponseEntity.ok(ApiResponse.ok("Lesson updated successfully", lesson));
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> deleteLesson(@PathVariable UUID lessonId) {
        service.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }
}
