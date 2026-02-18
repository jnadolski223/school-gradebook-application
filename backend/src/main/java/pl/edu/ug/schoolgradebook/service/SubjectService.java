package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequest;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequestName;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectResponse;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.repository.SubjectRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SubjectMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubjectService extends EntityService {
    private final SubjectRepository subjectRepository;
    private final SchoolRepository schoolRepository;
    private final SubjectMapper mapper;

    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        School school = getOrThrow(schoolRepository, School.class, request.schoolId());

        if (subjectRepository.existsBySchoolIdAndNameIgnoreCase(school.getId(), request.name())) {
            throw new ConflictException("The subject already exists for this school");
        }

        Subject subject = mapper.mapRequestToEntity(request, school);
        return mapper.mapEntityToResponse(subjectRepository.save(subject));
    }

    public SubjectResponse getSubjectById(UUID subjectId) {
        Subject subject = getOrThrow(subjectRepository, Subject.class, subjectId);
        return mapper.mapEntityToResponse(subject);
    }

    public List<SubjectResponse> getAllSubjectsBySchool(UUID schoolId) {
        return subjectRepository
                .findBySchoolId(schoolId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public SubjectResponse updateSubjectName(UUID subjectId, SubjectRequestName request) {
        Subject subject = getOrThrow(subjectRepository, Subject.class, subjectId);
        subject.setName(request.name());
        return mapper.mapEntityToResponse(subject);
    }

    @Transactional
    public void deleteSubject(UUID subjectId) {
        Subject subject = getOrThrow(subjectRepository, Subject.class, subjectId);
        subjectRepository.delete(subject);
    }
}
