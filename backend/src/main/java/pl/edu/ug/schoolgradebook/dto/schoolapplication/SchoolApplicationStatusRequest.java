package pl.edu.ug.schoolgradebook.dto.schoolapplication;

import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

public record SchoolApplicationStatusRequest(
        SchoolApplicationStatus status
) {}
