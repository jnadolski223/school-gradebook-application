package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.SchoolApplication;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationFullResponse;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationShortResponse;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;
import pl.edu.ug.schoolgradebook.repository.SchoolApplicationRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SchoolApplicationMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchoolApplicationService extends EntityService {
    private final SchoolApplicationRepository repository;
    private final SchoolApplicationMapper mapper;

    @Transactional
    public SchoolApplicationFullResponse createApplication(SchoolApplicationRequest request) {
        SchoolApplication application = mapper.mapRequestToEntity(request);
        return mapper.mapEntityToFullResponse(repository.save(application));
    }

    public SchoolApplicationFullResponse getApplicationById(UUID applicationId) {
        SchoolApplication application = getOrThrow(repository, SchoolApplication.class, applicationId);
        return mapper.mapEntityToFullResponse(application);
    }

    public List<SchoolApplicationShortResponse> getAllApplications() {
        return repository
                .findAll()
                .stream()
                .map(mapper::mapEntityToShortResponse)
                .toList();
    }

    @Transactional
    public SchoolApplicationFullResponse updateApplicationStatus(UUID applicationId, SchoolApplicationStatus status) {
        SchoolApplication application = getOrThrow(repository, SchoolApplication.class, applicationId);
        application.setStatus(status);
        return mapper.mapEntityToFullResponse(application);
    }

    @Transactional
    public void deleteApplication(UUID id) {
        SchoolApplication application = getOrThrow(repository, SchoolApplication.class, id);
        repository.delete(application);
    }
}
