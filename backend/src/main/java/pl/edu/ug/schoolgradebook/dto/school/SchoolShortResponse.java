package pl.edu.ug.schoolgradebook.dto.school;

import java.time.Instant;
import java.util.UUID;

public record SchoolShortResponse(
        UUID id,
        String name,
        Instant createdAt,
        Instant modifiedAt,
        boolean isActive
) {}
