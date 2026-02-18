package pl.edu.ug.schoolgradebook.dto.student;

import java.util.UUID;

public record StudentRequest(
        UUID schoolId,
        UUID schoolClassId,
        UUID parentId,
        String login,
        String password,
        String firstName,
        String lastName
) {}
