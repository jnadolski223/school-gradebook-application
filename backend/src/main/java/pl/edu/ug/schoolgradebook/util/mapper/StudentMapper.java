package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.SchoolClass;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.dto.student.StudentResponse;

@Component
public class StudentMapper {
    public Student mapRequestToEntity(SchoolMember schoolMember, SchoolMember parent, SchoolClass schoolClass) {
        return Student.builder()
                .schoolMember(schoolMember)
                .parent(parent)
                .schoolClass(schoolClass)
                .build();
    }

    public StudentResponse mapEntityToResponse(Student student) {
        return new StudentResponse(
                student.getSchoolMemberId(),
                student.getSchoolClass().getId(),
                student.getParent().getUserId(),
                student.getSchoolMember().getSchool().getId(),
                student.getSchoolMember().getUser().getLogin(),
                student.getSchoolMember().getFirstName(),
                student.getSchoolMember().getLastName(),
                student.getSchoolMember().getUser().getRole()
        );
    }

    public StudentResponse mapEntityToResponseWithoutSchoolId(Student student) {
        return new StudentResponse(
                student.getSchoolMemberId(),
                null,
                student.getParent().getUserId(),
                student.getSchoolMember().getSchool().getId(),
                student.getSchoolMember().getUser().getLogin(),
                student.getSchoolMember().getFirstName(),
                student.getSchoolMember().getLastName(),
                student.getSchoolMember().getUser().getRole()
        );
    }
}
