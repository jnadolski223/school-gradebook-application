package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.user.UserLoginResponse;
import pl.edu.ug.schoolgradebook.dto.user.UserRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserResponse;

import java.util.UUID;

@Component
public class UserMapper {
    public User mapRequestToEntity(UserRequest request) {
        return User.builder()
                .login(request.login())
                .password(request.password())
                .role(request.role())
                .active(true)
                .build();
    }

    public UserResponse mapEntityToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.isActive()
        );
    }

    public UserLoginResponse mapEntityToLoginResponse(User user, UUID schoolId) {
        return new UserLoginResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                schoolId,
                user.isActive()
        );
    }
}
