package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolClass;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassResponse;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassUpdateRequest;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.SchoolClassRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SchoolClassMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchoolClassService extends EntityService {
    private final SchoolClassRepository schoolClassRepository;
    private final SchoolRepository schoolRepository;
    private final SchoolMemberRepository schoolMemberRepository;
    private final SchoolClassMapper mapper;

    @Transactional
    public SchoolClassResponse createSchoolClass(SchoolClassRequest request) {
        School school = getOrThrow(schoolRepository, School.class, request.schoolId());
        SchoolMember teacher = getOrThrow(schoolMemberRepository, SchoolMember.class, request.homeroomTeacherId());

        if (teacher.getUser().getRole() != UserRole.TEACHER) {
            throw new ConflictException("School member must have TEACHER role");
        }

        teacher.getUser().setRole(UserRole.HOMEROOM_TEACHER);
        SchoolClass schoolClass = mapper.mapRequestToEntity(request, school, teacher);
        return mapper.mapEntityToResponse(schoolClassRepository.save(schoolClass));
    }

    public SchoolClassResponse getSchoolClassById(UUID schoolClassId) {
        SchoolClass schoolClass = getOrThrow(schoolClassRepository, SchoolClass.class, schoolClassId);
        return mapper.mapEntityToResponse(schoolClass);
    }

    public List<SchoolClassResponse> getAllSchoolClasses() {
        return schoolClassRepository
                .findAll()
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<SchoolClassResponse> getAllSchoolClassesBySchoolId(UUID schoolId) {
        return schoolClassRepository
                .findBySchool_Id(schoolId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public SchoolClassResponse updateSchoolClass(UUID schoolClassId, SchoolClassUpdateRequest request) {
        SchoolClass schoolClass = getOrThrow(schoolClassRepository, SchoolClass.class, schoolClassId);
        SchoolMember currentHomeroomTeacher = schoolClass.getHomeroomTeacher();

        if (request.name() != null) {
            schoolClass.setName(request.name());
        }

        if (request.homeroomTeacherId() != null && request.homeroomTeacherId() != currentHomeroomTeacher.getUser().getId()) {
            SchoolMember newHomeroomTeacher = getOrThrow(schoolMemberRepository, SchoolMember.class, request.homeroomTeacherId());
            schoolClass.setHomeroomTeacher(newHomeroomTeacher);
            newHomeroomTeacher.getUser().setRole(UserRole.HOMEROOM_TEACHER);
            currentHomeroomTeacher.getUser().setRole(UserRole.TEACHER);
        }

        return mapper.mapEntityToResponse(schoolClass);
    }

    @Transactional
    public void deleteSchoolClass(UUID schoolClassId) {
        SchoolClass schoolClass = getOrThrow(schoolClassRepository, SchoolClass.class, schoolClassId);
        schoolClass.getHomeroomTeacher().getUser().setRole(UserRole.TEACHER);
        schoolClassRepository.delete(schoolClass);
    }
}
