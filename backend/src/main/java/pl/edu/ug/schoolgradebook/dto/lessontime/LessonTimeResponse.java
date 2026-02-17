package pl.edu.ug.schoolgradebook.dto.lessontime;

import java.time.LocalTime;
import java.util.UUID;

public record LessonTimeResponse(
        UUID id,
        UUID schoolId,
        LocalTime lessonStart,
        LocalTime lessonEnd
) {}
