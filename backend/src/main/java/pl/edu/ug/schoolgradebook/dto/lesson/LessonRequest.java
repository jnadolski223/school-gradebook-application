package pl.edu.ug.schoolgradebook.dto.lesson;

import pl.edu.ug.schoolgradebook.enums.DayOfWeek;

import java.util.UUID;

public record LessonRequest(
        UUID teacherId,
        UUID schoolClassId,
        UUID subjectId,
        String room,
        UUID lessonTimeId,
        DayOfWeek day
) {}
