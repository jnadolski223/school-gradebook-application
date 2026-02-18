package pl.edu.ug.schoolgradebook.dto.schoolapplication;

import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

import java.time.Instant;
import java.util.UUID;

public record SchoolApplicationShortResponse(
        UUID id,
        String schoolName,
        Instant createdAt,
        SchoolApplicationStatus status
) {}
