package pl.edu.ug.schoolgradebook.dto.lessontime;

import java.time.LocalTime;

public record LessonTimeUpdateRequest(
        LocalTime lessonStart,
        LocalTime lessonEnd
) {}
