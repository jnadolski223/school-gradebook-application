package pl.edu.ug.schoolgradebook.dto.school;

public record SchoolRequest(
        String name,
        String street,
        String postalCode,
        String city,
        String phoneNumber,
        String email,
        String rspoNumber
) {}
