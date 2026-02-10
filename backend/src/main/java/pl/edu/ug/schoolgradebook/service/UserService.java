package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.user.*;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository repository;

    public UserResponse register(UserRegisterRequest request) {
        if (repository.existsByLogin(request.login())) {
            throw new ConflictException("Login is taken by another user");
        }

        User user = User.builder()
                .login(request.login())
                .password(request.password())
                .role(request.role())
                .isActive(true)
                .build();

        repository.save(user);
        return mapToDto(user);
    }

    public UserLoginResponse login(UserLoginRequest request) {
        User user = repository
                .findByLogin(request.login())
                .orElseThrow(() -> new IllegalArgumentException("Invalid login or password"));

        if (!user.isActive()) {
            throw new IllegalArgumentException("User is inactive");
        }

        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Invalid login or password");
        }

        return new UserLoginResponse(
                user.getId(),
                user.getLogin(),
                user.getRole()
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers(Boolean active) {
        List<User> users = active == null
                ? repository.findAll()
                : repository.findByIsActive(active);

        return users.stream().map(this::mapToDto).toList();
    }

    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        User user = repository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(User.class, id.toString()));

        if (request.login() != null && !request.login().equals(user.getLogin())) {
            if (repository.existsByLogin(request.login())) {
                throw new ConflictException("Login is taken by another user");
            }
            user.setLogin(request.login());
        }

        if (request.password() != null) {
            user.setPassword(request.password());
        }

        if (request.role() != null) {
            user.setRole(request.role());
        }

        repository.save(user);
        return mapToDto(user);
    }

    public void activate(UUID id) {
        setActive(id, true);
    }

    public void deactivate(UUID id) {
        setActive(id, false);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException(User.class, id.toString());
        }
        repository.deleteById(id);
    }

    private void setActive(UUID id, boolean active) {
        User user = repository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(User.class, id.toString()));
        user.setActive(active);
    }

    private UserResponse mapToDto(User user) {
        return new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.isActive()
        );
    }
}
