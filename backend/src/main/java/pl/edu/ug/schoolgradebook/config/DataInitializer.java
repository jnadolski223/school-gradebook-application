package pl.edu.ug.schoolgradebook.config;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import pl.edu.ug.schoolgradebook.dto.user.UserRequest;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.service.UserService;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;

    @Override
    public void run(String @NonNull ... args) {
        // Tworzenie przykładowego administratora aplikacji
        userService.registerUser(new UserRequest(
                "admin",
                "admin",
                UserRole.APP_ADMINISTRATOR
        ));
    }

}
