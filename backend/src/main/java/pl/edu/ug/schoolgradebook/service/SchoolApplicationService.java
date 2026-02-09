package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.SchoolApplication;
import pl.edu.ug.schoolgradebook.dto.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.SchoolApplicationResponseFull;
import pl.edu.ug.schoolgradebook.dto.SchoolApplicationResponseShort;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;
import pl.edu.ug.schoolgradebook.repository.SchoolApplicationRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SchoolApplicationService {
    private final SchoolApplicationRepository schoolApplicationRepository;

    public SchoolApplicationResponseFull createApplication(SchoolApplicationRequest requestDto) {
        SchoolApplication application = SchoolApplication.builder()
                .senderFirstName(requestDto.senderFirstName())
                .senderLastName(requestDto.senderLastName())
                .senderEmail(requestDto.senderEmail())
                .schoolName(requestDto.schoolName())
                .schoolStreet(requestDto.schoolStreet())
                .schoolPostalCode(requestDto.schoolPostalCode())
                .schoolCity(requestDto.schoolCity())
                .rspoNumber(requestDto.rspoNumber())
                .description(requestDto.description())
                .status(SchoolApplicationStatus.PENDING)
                .build();

        schoolApplicationRepository.save(application);

        return mapToFullDto(application);
    }

    public List<SchoolApplicationResponseShort> getAllApplicationsShort() {
        return schoolApplicationRepository
                .findAll()
                .stream()
                .map(this::mapToShortDto)
                .collect(Collectors.toList());
    }

    public List<SchoolApplicationResponseShort> getApplicationsByStatusShort(SchoolApplicationStatus status) {
        return schoolApplicationRepository
                .findByStatus(status)
                .stream()
                .map(this::mapToShortDto)
                .collect(Collectors.toList());
    }

    public SchoolApplicationResponseFull getApplicationById(UUID id) {
        SchoolApplication application = schoolApplicationRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Wniosek o podanym ID nie istnieje"));
        return mapToFullDto(application);
    }

    public SchoolApplicationResponseFull updateApplicationStatus(UUID id, SchoolApplicationStatus status) {
        SchoolApplication application = schoolApplicationRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Wniosek o podanym ID nie istnieje"));
        application.setStatus(status);
        schoolApplicationRepository.save(application);
        return mapToFullDto(application);
    }

    public void deleteApplication(UUID id) {
        if (!schoolApplicationRepository.existsById(id)) {
            throw new IllegalArgumentException("Wniosek o podanym ID nie istnieje");
        }
        schoolApplicationRepository.deleteById(id);
    }

    private SchoolApplicationResponseShort mapToShortDto(SchoolApplication schoolApplication) {
        return new SchoolApplicationResponseShort(
                schoolApplication.getId(),
                schoolApplication.getSchoolName(),
                schoolApplication.getCreatedAt(),
                schoolApplication.getStatus()
        );
    }

    private SchoolApplicationResponseFull mapToFullDto(SchoolApplication schoolApplication) {
        return new SchoolApplicationResponseFull(
                schoolApplication.getId(),
                schoolApplication.getSenderFirstName(),
                schoolApplication.getSenderLastName(),
                schoolApplication.getSenderEmail(),
                schoolApplication.getSchoolName(),
                schoolApplication.getSchoolStreet(),
                schoolApplication.getSchoolPostalCode(),
                schoolApplication.getSchoolCity(),
                schoolApplication.getRspoNumber(),
                schoolApplication.getDescription(),
                schoolApplication.getCreatedAt(),
                schoolApplication.getStatus()
        );
    }
}
