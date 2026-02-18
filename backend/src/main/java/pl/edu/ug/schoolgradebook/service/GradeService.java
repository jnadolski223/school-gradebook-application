package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.Grade;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.grade.GradeRequest;
import pl.edu.ug.schoolgradebook.dto.grade.GradeResponse;
import pl.edu.ug.schoolgradebook.repository.GradeRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.StudentRepository;
import pl.edu.ug.schoolgradebook.repository.SubjectRepository;
import pl.edu.ug.schoolgradebook.util.mapper.GradeMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GradeService extends EntityService {
    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final SchoolMemberRepository schoolMemberRepository;
    private final SubjectRepository subjectRepository;
    private final GradeMapper mapper;

    @Transactional
    public GradeResponse createGrade(GradeRequest request) {
        Student student = getOrThrow(studentRepository, Student.class, request.studentId());
        SchoolMember teacher = getOrThrow(schoolMemberRepository, SchoolMember.class, request.teacherId());
        Subject subject = getOrThrow(subjectRepository, Subject.class, request.subjectId());
        Grade grade = mapper.mapRequestToEntity(request, student, teacher, subject);
        return mapper.mapEntityToResponse(gradeRepository.save(grade));
    }

    public GradeResponse getGradeById(UUID gradeId) {
        Grade grade = getOrThrow(gradeRepository, Grade.class, gradeId);
        return mapper.mapEntityToResponse(grade);
    }

    public List<GradeResponse> getAllGrades() {
        return gradeRepository
                .findAll()
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<GradeResponse> getAllGradesByStudentId(UUID studentId) {
        return gradeRepository
                .findByStudent_SchoolMemberId(studentId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public GradeResponse updateGrade(UUID gradeId, GradeRequest request) {
        Grade grade = getOrThrow(gradeRepository, Grade.class, gradeId);
        Student student = getOrThrow(studentRepository, Student.class, request.studentId());
        SchoolMember teacher = getOrThrow(schoolMemberRepository, SchoolMember.class, request.teacherId());
        Subject subject = getOrThrow(subjectRepository, Subject.class, request.subjectId());

        grade.setStudent(student);
        grade.setTeacher(teacher);
        grade.setSubject(subject);
        grade.setGradeValue(request.gradeValue());
        grade.setGradeType(request.gradeType());
        grade.setWeight(request.weight());
        grade.setCountToAverage(request.countToAverage());
        grade.setDescription(request.description());

        return mapper.mapEntityToResponse(grade);
    }

    @Transactional
    public void deleteGrade(UUID gradeId) {
        Grade grade = getOrThrow(gradeRepository, Grade.class, gradeId);
        gradeRepository.delete(grade);
    }
}
