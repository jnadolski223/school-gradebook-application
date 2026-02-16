package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.dto.school.SchoolFullResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.school.SchoolShortResponse;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SchoolMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchoolService extends EntityService {
    private final SchoolRepository schoolRepository;
    private final SchoolMemberRepository schoolMemberRepository;
    private final SchoolMapper mapper;

    @Transactional
    public SchoolFullResponse createSchool(SchoolRequest request) {
        School school = mapper.mapRequestToEntity(request);
        return mapper.mapEntityToFullResponse(schoolRepository.save(school));
    }

    public SchoolFullResponse getSchoolById(UUID schoolId) {
        School school = getOrThrow(schoolRepository, School.class, schoolId);
        return mapper.mapEntityToFullResponse(school);
    }

    public List<SchoolShortResponse> getAllSchools() {
        return schoolRepository
                .findAll()
                .stream()
                .map(mapper::mapEntityToShortResponse)
                .toList();
    }

    @Transactional
    public SchoolFullResponse updateSchool(UUID schoolId, SchoolRequest request) {
        School school = getOrThrow(schoolRepository, School.class, schoolId);

        school.setName(request.name());
        school.setStreet(request.street());
        school.setPostalCode(request.postalCode());
        school.setCity(request.city());
        school.setPhoneNumber(request.phoneNumber());
        school.setEmail(request.email());
        school.setRspoNumber(request.rspoNumber());

        return mapper.mapEntityToFullResponse(school);
    }

    @Transactional
    public void deleteSchool(UUID schoolId) {
        School school = getOrThrow(schoolRepository, School.class, schoolId);
        schoolRepository.delete(school);
    }

    @Transactional
    public void activateSchool(UUID schoolId) {
        School school = getOrThrow(schoolRepository, School.class, schoolId);
        school.setActive(true);
    }

    @Transactional
    public void deactivateSchool(UUID schoolId) {
        School school = getOrThrow(schoolRepository, School.class, schoolId);
        school.setActive(false);
    }

    public boolean isSchoolAdminCreated(UUID schoolId) {
        return schoolMemberRepository.existsBySchool_IdAndUser_Role(schoolId, UserRole.SCHOOL_ADMINISTRATOR);
    }
}
