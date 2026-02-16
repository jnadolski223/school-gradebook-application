package pl.edu.ug.schoolgradebook.dto.school;

import java.time.Instant;
import java.util.UUID;

public record SchoolFullResponse(
        UUID id,
        String name,
        String street,
        String postalCode,
        String city,
        String phoneNumber,
        String email,
        String rspoNumber,
        Instant createdAt,
        Instant modifiedAt,
        boolean isActive
) {}
