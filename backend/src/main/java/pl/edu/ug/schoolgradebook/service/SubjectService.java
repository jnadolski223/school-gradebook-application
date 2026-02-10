package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectCreateRequest;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectResponse;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectUpdateRequest;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.repository.SubjectRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final SchoolRepository schoolRepository;

    public SubjectResponse create(SubjectCreateRequest request) {
        School school = schoolRepository
                .findById(request.schoolId())
                .orElseThrow(() -> new EntityNotFoundException(School.class, request.schoolId().toString()));

        if (subjectRepository.existsBySchoolIdAndNameIgnoreCase(school.getId(), request.name())) {
            throw new ConflictException("This subject already exists for this school");
        }

        Subject subject = Subject.builder().school(school).name(request.name()).build();
        subjectRepository.save(subject);
        return mapToDto(subject);
    }

    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllBySchool(UUID schoolId) {
        return subjectRepository.findBySchoolId(schoolId).stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public SubjectResponse getById(UUID id) {
        Subject subject = subjectRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Subject.class, id.toString()));
        return mapToDto(subject);
    }

    public SubjectResponse update(UUID id, SubjectUpdateRequest request) {
        Subject subject = subjectRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Subject.class, id.toString()));
        subject.setName(request.name());
        subjectRepository.save(subject);
        return  mapToDto(subject);
    }

    public void delete(UUID id) {
        if (!subjectRepository.existsById(id)) {
            throw new EntityNotFoundException(Subject.class, id.toString());
        }
        subjectRepository.deleteById(id);
    }

    private SubjectResponse mapToDto(Subject subject) {
        return new SubjectResponse(
                subject.getId(),
                subject.getSchool().getId(),
                subject.getName()
        );
    }
}
