package pl.edu.ug.schoolgradebook.dto.schoolapplication;

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
