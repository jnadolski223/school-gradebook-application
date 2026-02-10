package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolClass;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassCreateRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassResponse;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassUpdateRequest;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.SchoolClassRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SchoolClassService {

    private final SchoolClassRepository schoolClassRepository;
    private final SchoolRepository schoolRepository;
    private final SchoolMemberRepository schoolMemberRepository;

    public SchoolClassResponse create(SchoolClassCreateRequest request) {
        School school = schoolRepository
                .findById(request.schoolId())
                .orElseThrow(() -> new EntityNotFoundException(School.class, request.schoolId().toString()));

        SchoolMember homeroomTeacher = getTeacher(request.homeroomTeacherId());

        SchoolClass schoolClass = SchoolClass.builder()
                .school(school)
                .homeroomTeacher(homeroomTeacher)
                .name(request.name())
                .build();

        schoolClassRepository.save(schoolClass);
        return mapToDto(schoolClass);
    }

    public List<SchoolClassResponse> getAll(UUID schoolId) {
        List<SchoolClass> classes = schoolId == null
                ? schoolClassRepository.findAll()
                : schoolClassRepository.findBySchool_Id(schoolId);

        return classes.stream().map(this::mapToDto).toList();
    }

    public SchoolClassResponse getById(UUID id) {
        return schoolClassRepository
                .findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new EntityNotFoundException(SchoolClass.class, id.toString()));
    }

    public SchoolClassResponse update(UUID id, SchoolClassUpdateRequest request) {
        SchoolClass schoolClass = schoolClassRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(SchoolClass.class, id.toString()));

        if (request.name() != null) {
            schoolClass.setName(request.name());
        }

        if (request.homeroomTeacherId() != null) {
            SchoolMember teacher = getTeacher(request.homeroomTeacherId());
            schoolClass.setHomeroomTeacher(teacher);
        }

        schoolClassRepository.save(schoolClass);
        return mapToDto(schoolClass);
    }

    public void delete(UUID id) {
        if (!schoolClassRepository.existsById(id)) {
            throw new EntityNotFoundException(SchoolClass.class, id.toString());
        }
        schoolClassRepository.deleteById(id);
    }

    private SchoolMember getTeacher(UUID schoolMemberId) {
        SchoolMember member = schoolMemberRepository
                .findById(schoolMemberId)
                .orElseThrow(() -> new EntityNotFoundException(SchoolMember.class, schoolMemberId.toString()));

        if (member.getUser().getRole() != UserRole.TEACHER) {
            throw new ConflictException("Homeroom teacher must have TEACHER role");
        }

        return member;
    }

    private SchoolClassResponse mapToDto(SchoolClass schoolClass) {
        return new SchoolClassResponse(
                schoolClass.getId(),
                schoolClass.getSchool().getId(),
                schoolClass.getHomeroomTeacher().getUserId(),
                schoolClass.getName()
        );
    }
}
