package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.*;
import pl.edu.ug.schoolgradebook.dto.student.StudentResponse;
import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class StudentMapperTests {

    private final StudentMapper mapper = new StudentMapper();

    @Test
    @DisplayName("Should correctly map request to Student entity")
    void shouldMapRequestToEntity() {
        SchoolMember schoolMember = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        SchoolMember parent = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        SchoolClass schoolClass = SchoolClass.builder()
                .id(UUID.randomUUID())
                .build();

        Student student = mapper.mapRequestToEntity(schoolMember, parent, schoolClass);

        assertThat(student).isNotNull();
        assertThat(student.getSchoolMemberId()).isNull();
        assertThat(student.getSchoolMember()).isEqualTo(schoolMember);
        assertThat(student.getParent()).isEqualTo(parent);
        assertThat(student.getSchoolClass()).isEqualTo(schoolClass);
    }

    @Test
    @DisplayName("Should correctly map Student entity to StudentResponse DTO (with SchoolClassId)")
    void shouldMapEntityToResponseWithSchoolClassId() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .login("john-doe-123")
                .role(UserRole.TEACHER)
                .build();

        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        SchoolMember schoolMember = SchoolMember.builder()
                .userId(user.getId())
                .user(user)
                .school(school)
                .firstName("John")
                .lastName("Doe")
                .build();

        SchoolMember parent = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        SchoolClass schoolClass = SchoolClass.builder()
                .id(UUID.randomUUID())
                .build();

        Student student = Student.builder()
                .schoolMemberId(schoolMember.getUserId())
                .schoolMember(schoolMember)
                .parent(parent)
                .schoolClass(schoolClass)
                .build();

        StudentResponse response = mapper.mapEntityToResponse(student);

        assertThat(response).isNotNull();
        assertThat(response.schoolMemberId()).isEqualTo(student.getSchoolMemberId());
        assertThat(response.schoolClassId()).isEqualTo(student.getSchoolClass().getId());
        assertThat(response.parentId()).isEqualTo(student.getParent().getUserId());
        assertThat(response.schoolId()).isEqualTo(student.getSchoolMember().getSchool().getId());
        assertThat(response.login()).isEqualTo(student.getSchoolMember().getUser().getLogin());
        assertThat(response.firstName()).isEqualTo(student.getSchoolMember().getFirstName());
        assertThat(response.lastName()).isEqualTo(student.getSchoolMember().getLastName());
        assertThat(response.role()).isEqualTo(student.getSchoolMember().getUser().getRole());
    }

    @Test
    @DisplayName("Should correctly map Student entity to StudentResponse DTO (without SchoolClassId)")
    void shouldMapEntityToResponseWithoutSchoolClassId() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .login("john-doe-123")
                .role(UserRole.TEACHER)
                .build();

        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        SchoolMember schoolMember = SchoolMember.builder()
                .userId(user.getId())
                .user(user)
                .school(school)
                .firstName("John")
                .lastName("Doe")
                .build();

        SchoolMember parent = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        Student student = Student.builder()
                .schoolMemberId(schoolMember.getUserId())
                .schoolMember(schoolMember)
                .parent(parent)
                .build();

        StudentResponse response = mapper.mapEntityToResponse(student);

        assertThat(response).isNotNull();
        assertThat(response.schoolMemberId()).isEqualTo(student.getSchoolMemberId());
        assertThat(response.schoolClassId()).isNull();
        assertThat(response.parentId()).isEqualTo(student.getParent().getUserId());
        assertThat(response.schoolId()).isEqualTo(student.getSchoolMember().getSchool().getId());
        assertThat(response.login()).isEqualTo(student.getSchoolMember().getUser().getLogin());
        assertThat(response.firstName()).isEqualTo(student.getSchoolMember().getFirstName());
        assertThat(response.lastName()).isEqualTo(student.getSchoolMember().getLastName());
        assertThat(response.role()).isEqualTo(student.getSchoolMember().getUser().getRole());
    }
}
