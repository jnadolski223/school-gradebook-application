package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeRequest;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeResponse;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeUpdateRequest;
import pl.edu.ug.schoolgradebook.service.LessonTimeService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.LESSON_TIMES)
@RequiredArgsConstructor
public class LessonTimeController {
    private final LessonTimeService service;

    @PostMapping
    public ResponseEntity<ApiResponse<LessonTimeResponse>> createLessonTime(@RequestBody LessonTimeRequest request) {
        LessonTimeResponse lessonTime = service.createLessonTime(request);
        URI location = URI.create(ApiPaths.LESSON_TIMES + "/" + lessonTime.id());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("Lesson time created successfully", lessonTime));
    }

    @GetMapping("/{lessonTimeId}")
    public ResponseEntity<ApiResponse<LessonTimeResponse>> getLessonTimeById(@PathVariable UUID lessonTimeId) {
        LessonTimeResponse lessonTime = service.getLessonTimeById(lessonTimeId);
        return ResponseEntity.ok(ApiResponse.ok("Lesson time retrieved successfully", lessonTime));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonTimeResponse>>> getAllLessonTimesBySchoolId(@RequestParam UUID schoolId) {
        List<LessonTimeResponse> lessonTimes = service.getAllLessonTimesBySchoolId(schoolId);
        String message = "All lesson times for school with ID " + schoolId + "retrieved successfully";
        return ResponseEntity.ok(ApiResponse.ok(message, lessonTimes));
    }

    @PatchMapping("/{lessonTimeId}")
    public ResponseEntity<ApiResponse<LessonTimeResponse>> updateLessonTime(
            @PathVariable UUID lessonTimeId,
            @RequestBody LessonTimeUpdateRequest request
    ) {
        LessonTimeResponse lessonTime = service.updateLessonTime(lessonTimeId, request);
        return ResponseEntity.ok(ApiResponse.ok("Lesson time updated successfully", lessonTime));
    }

    @DeleteMapping("/{lessonTimeId}")
    public ResponseEntity<Void> deleteLessonTime(@PathVariable UUID lessonTimeId) {
        service.deleteLessonTime(lessonTimeId);
        return ResponseEntity.noContent().build();
    }
}
