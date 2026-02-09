package pl.edu.ug.schoolgradebook.dto;

public record SchoolApplicationRequest(
        String senderFirstName,
        String senderLastName,
        String senderEmail,
        String schoolName,
        String schoolStreet,
        String schoolPostalCode,
        String schoolCity,
        String rspoNumber,
        String description
) {}
