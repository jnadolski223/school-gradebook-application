package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.SchoolApplication;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationResponseFull;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationResponseShort;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.SchoolApplicationRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SchoolApplicationService {
    private final SchoolApplicationRepository repository;

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

        repository.save(application);

        return mapToFullDto(application);
    }

    @Transactional(readOnly = true)
    public List<SchoolApplicationResponseShort> getAllApplications() {
        return repository
                .findAll()
                .stream()
                .map(this::mapToShortDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SchoolApplicationResponseShort> getAllApplicationsByStatus(SchoolApplicationStatus status) {
        return repository
                .findByStatus(status)
                .stream()
                .map(this::mapToShortDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SchoolApplicationResponseFull getApplicationById(UUID id) {
        SchoolApplication application = repository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(SchoolApplication.class, id.toString()));
        return mapToFullDto(application);
    }

    public SchoolApplicationResponseFull updateApplicationStatus(UUID id, SchoolApplicationStatus status) {
        SchoolApplication application = repository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(SchoolApplication.class, id.toString()));
        application.setStatus(status);
        repository.save(application);
        return mapToFullDto(application);
    }

    public void deleteApplication(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException(SchoolApplication.class, id.toString());
        }
        repository.deleteById(id);
    }

    private SchoolApplicationResponseShort mapToShortDto(SchoolApplication application) {
        return new SchoolApplicationResponseShort(
                application.getId(),
                application.getSchoolName(),
                application.getCreatedAt(),
                application.getStatus()
        );
    }

    private SchoolApplicationResponseFull mapToFullDto(SchoolApplication application) {
        return new SchoolApplicationResponseFull(
                application.getId(),
                application.getSenderFirstName(),
                application.getSenderLastName(),
                application.getSenderEmail(),
                application.getSchoolName(),
                application.getSchoolStreet(),
                application.getSchoolPostalCode(),
                application.getSchoolCity(),
                application.getRspoNumber(),
                application.getDescription(),
                application.getCreatedAt(),
                application.getStatus()
        );
    }
}
