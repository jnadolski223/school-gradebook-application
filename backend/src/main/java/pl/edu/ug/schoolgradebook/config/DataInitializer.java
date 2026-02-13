package pl.edu.ug.schoolgradebook.config;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.school.SchoolResponseFull;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberCreateRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserRegisterRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserResponse;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.service.SchoolMemberService;
import pl.edu.ug.schoolgradebook.service.SchoolService;
import pl.edu.ug.schoolgradebook.service.UserService;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;
    private final SchoolService schoolService;
    private final SchoolMemberService schoolMemberService;

    @Override
    public void run(String @NonNull ... args) {
        // Tworzenie przykładowego administratora aplikacji
        UserRegisterRequest appAdminRequest = new UserRegisterRequest(
                "admin",
                "admin",
                UserRole.APP_ADMINISTRATOR
        );
        userService.register(appAdminRequest);

        // Tworzenie przykładowego administratora szkoły
        UserRegisterRequest schoolAdminRequest = new UserRegisterRequest(
                "school-admin-1",
                "test123",
                UserRole.SCHOOL_ADMINISTRATOR
        );
        UserResponse schoolAdmin = userService.register(schoolAdminRequest);

        // Tworzenie przykładowej szkoły
        SchoolRequest schoolRequest = new SchoolRequest(
                "Szkoła Podstawowa nr 1 w Gdańsku",
                "Przykładowa 42",
                "00-000",
                "Gdańsk",
                "+48123456789",
                "sp1@example.com",
                "123456"
        );
        SchoolResponseFull school = schoolService.create(schoolRequest);

        // Utworzenie wpisu, że schoolAdmin jest członkiem szkoły school
        SchoolMemberCreateRequest schoolMemberCreateRequest = new SchoolMemberCreateRequest(
                schoolAdmin.id(),
                school.id(),
                "Jan",
                "Kowalski"
        );

        schoolMemberService.create(schoolMemberCreateRequest);
    }

}
