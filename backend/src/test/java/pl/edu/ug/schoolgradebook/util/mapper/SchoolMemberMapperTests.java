package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberRequest;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberResponse;
import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class SchoolMemberMapperTests {

    private final SchoolMemberMapper mapper = new SchoolMemberMapper();

    @Test
    @DisplayName("Should correctly map SchoolMemberRequest DTO to SchoolMember entity")
    void shouldMapRequestToEntity() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .build();

        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        SchoolMemberRequest request = new SchoolMemberRequest(
                school.getId(),
                "john-doe-123",
                "test123",
                "John",
                "Doe",
                UserRole.TEACHER
        );

        SchoolMember schoolMember = mapper.mapRequestToEntity(request, user, school);

        assertThat(schoolMember).isNotNull();
        assertThat(schoolMember.getUserId()).isNull();
        assertThat(schoolMember.getUser()).isEqualTo(user);
        assertThat(schoolMember.getFirstName()).isEqualTo(request.firstName());
        assertThat(schoolMember.getLastName()).isEqualTo(request.lastName());
    }

    @Test
    @DisplayName("Should correctly map SchoolMember entity to SchoolMemberResponse DTO")
    void shouldMapEntityToResponse() {
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

        SchoolMemberResponse response = mapper.mapEntityToResponse(schoolMember);

        assertThat(response).isNotNull();
        assertThat(response.userId()).isEqualTo(schoolMember.getUserId());
        assertThat(response.schoolId()).isEqualTo(schoolMember.getSchool().getId());
        assertThat(response.login()).isEqualTo(schoolMember.getUser().getLogin());
        assertThat(response.firstName()).isEqualTo(schoolMember.getFirstName());
        assertThat(response.lastName()).isEqualTo(schoolMember.getLastName());
        assertThat(response.role()).isEqualTo(schoolMember.getUser().getRole());
    }
}
