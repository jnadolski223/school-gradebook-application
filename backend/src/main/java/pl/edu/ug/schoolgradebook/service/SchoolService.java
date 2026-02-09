package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.school.SchoolResponseFull;
import pl.edu.ug.schoolgradebook.dto.school.SchoolResponseShort;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SchoolService {

    private final SchoolRepository repository;

    public SchoolResponseFull create(SchoolRequest request) {
        School school = School.builder()
                .name(request.name())
                .street(request.street())
                .postalCode(request.postalCode())
                .city(request.city())
                .phoneNumber(request.phoneNumber())
                .email(request.email())
                .rspoNumber(request.rspoNumber())
                .isActive(true)
                .build();

        repository.save(school);

        return mapToFullDto(school);
    }

    @Transactional(readOnly = true)
    public List<SchoolResponseShort> getAll(Boolean active) {
        List<School> schools = active == null
                ? repository.findAll()
                : repository.findByIsActive(active);

        return schools.stream().map(this::mapToShortDto).toList();
    }

    @Transactional(readOnly = true)
    public SchoolResponseFull getById(UUID id) {
        return mapToFullDto(findSchool(id));
    }

    public SchoolResponseFull update(UUID id, SchoolRequest request) {
        School school = findSchool(id);

        school.setName(request.name());
        school.setStreet(request.street());
        school.setPostalCode(request.postalCode());
        school.setCity(request.city());
        school.setPhoneNumber(request.phoneNumber());
        school.setEmail(request.email());
        school.setRspoNumber(request.rspoNumber());

        repository.save(school);

        return mapToFullDto(school);
    }

    public void activate(UUID id) {
        School school = findSchool(id);
        school.setActive(true);
        repository.save(school);
    }

    public void deactivate(UUID id) {
        School school = findSchool(id);
        school.setActive(false);
        repository.save(school);
    }

    public void delete(UUID id) {
        repository.delete(findSchool(id));
    }

    private SchoolResponseShort mapToShortDto(School school) {
        return new SchoolResponseShort(
                school.getId(),
                school.getName(),
                school.getCreatedAt(),
                school.getModifiedAt(),
                school.isActive()
        );
    }

    private SchoolResponseFull mapToFullDto(School school) {
        return new SchoolResponseFull(
                school.getId(),
                school.getName(),
                school.getStreet(),
                school.getPostalCode(),
                school.getCity(),
                school.getPhoneNumber(),
                school.getEmail(),
                school.getRspoNumber(),
                school.getCreatedAt(),
                school.getModifiedAt(),
                school.isActive()
        );
    }

    private School findSchool(UUID id) {
        return repository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(School.class, id.toString()));
    }
}
