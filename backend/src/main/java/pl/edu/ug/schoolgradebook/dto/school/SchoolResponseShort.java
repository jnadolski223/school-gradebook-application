package pl.edu.ug.schoolgradebook.dto.school;

import java.time.Instant;
import java.util.UUID;

public record SchoolResponseShort(
        UUID id,
        String name,
        Instant createdAt,
        Instant modifiedAt,
        boolean isActive
) {}
