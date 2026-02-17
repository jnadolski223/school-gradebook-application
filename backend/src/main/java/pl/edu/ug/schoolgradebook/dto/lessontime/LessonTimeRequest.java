package pl.edu.ug.schoolgradebook.dto.lessontime;

import java.time.LocalTime;
import java.util.UUID;

public record LessonTimeRequest(
        UUID schoolId,
        LocalTime lessonStart,
        LocalTime lessonEnd
) {}
