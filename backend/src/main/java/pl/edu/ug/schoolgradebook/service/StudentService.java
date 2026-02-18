package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.SchoolClass;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberRequest;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberResponse;
import pl.edu.ug.schoolgradebook.dto.student.StudentRequest;
import pl.edu.ug.schoolgradebook.dto.student.StudentResponse;
import pl.edu.ug.schoolgradebook.dto.student.StudentUpdateRequest;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.BadRequestException;
import pl.edu.ug.schoolgradebook.repository.SchoolClassRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.StudentRepository;
import pl.edu.ug.schoolgradebook.util.mapper.StudentMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService extends EntityService {
    private final StudentRepository studentRepository;
    private final SchoolMemberRepository schoolMemberRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SchoolMemberService schoolMemberService;
    private final StudentMapper mapper;

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        SchoolMemberRequest schoolMemberRequest = new SchoolMemberRequest(
                request.schoolId(),
                request.login(),
                request.password(),
                request.firstName(),
                request.lastName(),
                UserRole.STUDENT
        );
        SchoolMemberResponse createdMember = schoolMemberService.createSchoolMember(schoolMemberRequest);
        SchoolMember member = getOrThrow(schoolMemberRepository, SchoolMember.class, createdMember.userId());
        if (request.parentId() == null) {
            throw new BadRequestException("Parent ID is missing");
        }

        SchoolMember parent = getOrThrow(schoolMemberRepository, SchoolMember.class, request.parentId());
        if (parent.getUser().getRole() != UserRole.PARENT) {
            throw new BadRequestException("Parent must have PARENT role");
        }

        if (request.schoolClassId() != null) {
            SchoolClass schoolClass = getOrThrow(schoolClassRepository, SchoolClass.class, request.schoolClassId());
            Student student = mapper.mapRequestToEntity(member, parent, schoolClass);
            return mapper.mapEntityToResponse(studentRepository.save(student));
        } else {
            Student student = mapper.mapRequestToEntity(member, parent, null);
            return mapper.mapEntityToResponseWithoutSchoolId(student);
        }

    }

    public StudentResponse getStudentById(UUID studentId) {
        Student student = getOrThrow(studentRepository, Student.class, studentId);
        return mapper.mapEntityToResponse(student);
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository
                .findAll()
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<StudentResponse> getAllStudentsBySchoolClass(UUID schoolClassId) {
        return studentRepository
                .findBySchoolClass_Id(schoolClassId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<StudentResponse> getAllStudentsByParentId(UUID parentId) {
        return studentRepository
                .findByParent_UserId(parentId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public StudentResponse updateStudent(UUID studentId, StudentUpdateRequest request) {
        Student student = getOrThrow(studentRepository, Student.class, studentId);

        if (request.schoolClassId() != null && request.schoolClassId() != student.getSchoolClass().getId()) {
            SchoolClass schoolClass = getOrThrow(schoolClassRepository, SchoolClass.class, request.schoolClassId());
            student.setSchoolClass(schoolClass);
        }

        if (request.parentId() != null && request.parentId() != student.getParent().getUserId()) {
            SchoolMember parent = getOrThrow(schoolMemberRepository, SchoolMember.class, request.parentId());
            student.setParent(parent);
        }

        return mapper.mapEntityToResponse(student);
    }

    @Transactional
    public void deleteStudent(UUID studentId) {
        Student student = getOrThrow(studentRepository, Student.class, studentId);
        studentRepository.delete(student);
    }
}
