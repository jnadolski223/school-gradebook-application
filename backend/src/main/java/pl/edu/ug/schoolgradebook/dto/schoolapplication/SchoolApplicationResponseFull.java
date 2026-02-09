package pl.edu.ug.schoolgradebook.dto.schoolapplication;

import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

import java.time.Instant;
import java.util.UUID;

public record SchoolApplicationResponseFull(
        UUID id,
        String senderFirstName,
        String senderLastName,
        String senderEmail,
        String schoolName,
        String schoolStreet,
        String schoolPostalCode,
        String schoolCity,
        String rspoNumber,
        String description,
        Instant createdAt,
        SchoolApplicationStatus status
) {}
