package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.user.UserLoginResponse;
import pl.edu.ug.schoolgradebook.dto.user.UserRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserResponse;
import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class UserMapperTests {

    private final UserMapper mapper = new UserMapper();

    @Test
    @DisplayName("Should correctly map UserRequest DTO to User entity")
    void shouldMapRequestToEntity() {
        UserRequest request = new UserRequest(
                "john-doe-123",
                "test123",
                UserRole.TEACHER
        );

        User user = mapper.mapRequestToEntity(request);

        assertThat(user).isNotNull();
        assertThat(user.getId()).isNull();
        assertThat(user.getLogin()).isEqualTo(request.login());
        assertThat(user.getPassword()).isEqualTo(request.password());
        assertThat(user.getRole()).isEqualTo(request.role());
        assertThat(user.getCreatedAt()).isNull();
        assertThat(user.getModifiedAt()).isNull();
        assertThat(user.isActive()).isTrue();
    }

    @Test
    @DisplayName("Should correctly map User entity to UserResponse DTO")
    void shouldMapEntityToResponse() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .login("john-doe-123")
                .password("test123")
                .role(UserRole.TEACHER)
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .active(true)
                .build();

        UserResponse response = mapper.mapEntityToResponse(user);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(user.getId());
        assertThat(response.login()).isEqualTo(user.getLogin());
        assertThat(response.role()).isEqualTo(user.getRole());
        assertThat(response.createdAt()).isEqualTo(user.getCreatedAt());
        assertThat(response.modifiedAt()).isEqualTo(user.getModifiedAt());
        assertThat(response.isActive()).isEqualTo(user.isActive());
    }

    @Test
    @DisplayName("Should correctly map User entity to UserLoginResponse DTO")
    void shouldMapEntityToLoginResponse() {
        UUID schoolId = UUID.randomUUID();

        User user = User.builder()
                .id(UUID.randomUUID())
                .login("john-doe-123")
                .password("test123")
                .role(UserRole.TEACHER)
                .active(true)
                .build();

        UserLoginResponse response = mapper.mapEntityToLoginResponse(user, schoolId);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(user.getId());
        assertThat(response.login()).isEqualTo(user.getLogin());
        assertThat(response.role()).isEqualTo(user.getRole());
        assertThat(response.schoolId()).isEqualTo(schoolId);
        assertThat(response.isActive()).isEqualTo(user.isActive());
    }
}
