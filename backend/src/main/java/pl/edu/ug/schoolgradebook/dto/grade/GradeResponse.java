package pl.edu.ug.schoolgradebook.dto.grade;

import pl.edu.ug.schoolgradebook.enums.GradeType;
import pl.edu.ug.schoolgradebook.enums.GradeValue;

import java.time.Instant;
import java.util.UUID;

public record GradeResponse(
        UUID id,
        UUID studentId,
        UUID teacherId,
        UUID subjectId,
        GradeValue gradeValue,
        GradeType gradeType,
        int weight,
        boolean countToAverage,
        Instant createdAt,
        Instant modifiedAt,
        String description
) {}
