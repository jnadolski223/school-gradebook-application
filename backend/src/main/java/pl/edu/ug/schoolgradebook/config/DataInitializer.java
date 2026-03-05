package pl.edu.ug.schoolgradebook.config;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import pl.edu.ug.schoolgradebook.dto.grade.GradeRequest;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonRequest;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeRequest;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolFullResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassResponse;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberRequest;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberResponse;
import pl.edu.ug.schoolgradebook.dto.student.StudentRequest;
import pl.edu.ug.schoolgradebook.dto.student.StudentResponse;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequest;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectResponse;
import pl.edu.ug.schoolgradebook.dto.user.UserRequest;
import pl.edu.ug.schoolgradebook.enums.DayOfWeek;
import pl.edu.ug.schoolgradebook.enums.GradeType;
import pl.edu.ug.schoolgradebook.enums.GradeValue;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.service.*;

import java.time.LocalTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;
    private final SchoolApplicationService schoolApplicationService;
    private final SchoolService schoolService;
    private final SubjectService subjectService;
    private final LessonTimeService lessonTimeService;
    private final SchoolMemberService schoolMemberService;
    private final SchoolClassService schoolClassService;
    private final StudentService studentService;
    private final LessonService lessonService;
    private final GradeService gradeService;

    @Override
    public void run(String @NonNull ... args) {
        // ========== Tworzenie przykładowego administratora aplikacji ==========
        userService.registerUser(new UserRequest(
                "admin",
                "admin",
                UserRole.APP_ADMINISTRATOR
        ));

        // ========== Tworzenie przykładowych wniosków ==========
        schoolApplicationService.createSchoolApplication(new SchoolApplicationRequest(
                "Jan",
                "Kowalski",
                "sekretariat@sp1gdansk.pl",
                "Szkoła Podstawowa nr 1 w Gdańsku",
                "Szkolna 42",
                "80-369",
                "Gdańsk",
                "849223",
                "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."
        ));

        schoolApplicationService.createSchoolApplication(new SchoolApplicationRequest(
                "Anna",
                "Nowak",
                "sekretariat@lo1gdansk.pl",
                "Liceum Ogólnokształcące nr 1 w Gdańsku",
                "Słoneczna 13",
                "83-322",
                "Gdańsk",
                "438291",
                "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."
        ));

        schoolApplicationService.createSchoolApplication(new SchoolApplicationRequest(
                "Małgorzata",
                "Budzisz",
                "sekretariat@sb1gdansk.pl",
                "Szkoła Branżowa nr 1 w Gdańsku",
                "Spokojna 10",
                "83-921",
                "Gdańsk",
                "543008",
                "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."
        ));

        // ========== Tworzenie przykładowych szkół ==========
        SchoolFullResponse school1 = schoolService.createSchool(new SchoolRequest(
                "Szkoła Podstawowa nr 1 w Gdańsku",
                "Szkolna 42",
                "80-369",
                "Gdańsk",
                "+48629401854",
                "sekretariat@sp1gdansk.pl",
                "849223"
        ));

        schoolService.createSchool(new SchoolRequest(
                "Liceum Ogólnokształcące nr 1 w Gdańsku",
                "Słoneczna 13",
                "83-322",
                "Gdańsk",
                "+48225491821",
                "sekretariat@lo1gdansk.pl",
                "438291"
        ));

        schoolService.createSchool(new SchoolRequest(
                "Szkoła Branżowa nr 1 w Gdańsku",
                "Spokojna 10",
                "83-921",
                "Gdańsk",
                "+48846194638",
                "sekretariat@sb1gdansk.pl",
                "543008"
        ));

        // ========== Tworzenie przykładowych przedmiotów ==========
        SubjectResponse mathSubject = subjectService.createSubject(new SubjectRequest(
                school1.id(),
                "Matematyka"
        ));

        SubjectResponse englishSubject = subjectService.createSubject(new SubjectRequest(
                school1.id(),
                "Język angielski"
        ));

        SubjectResponse polishSubject = subjectService.createSubject(new SubjectRequest(
                school1.id(),
                "Język polski"
        ));

        SubjectResponse itSubject = subjectService.createSubject(new SubjectRequest(
                school1.id(),
                "Informatyka"
        ));

        SubjectResponse peSubject = subjectService.createSubject(new SubjectRequest(
                school1.id(),
                "Wychowanie fizyczne"
        ));

        // ========== Tworzenie przykładowych godzin lekcyjnych ==========
        LessonTimeResponse lessonTime1 = lessonTimeService.createLessonTime(new LessonTimeRequest(
                school1.id(),
                LocalTime.of(8, 0),
                LocalTime.of(8, 45)
        ));

        LessonTimeResponse lessonTime2 = lessonTimeService.createLessonTime(new LessonTimeRequest(
                school1.id(),
                LocalTime.of(8, 55),
                LocalTime.of(9, 40)
        ));

        LessonTimeResponse lessonTime3 = lessonTimeService.createLessonTime(new LessonTimeRequest(
                school1.id(),
                LocalTime.of(9, 50),
                LocalTime.of(10, 35)
        ));

        LessonTimeResponse lessonTime4 = lessonTimeService.createLessonTime(new LessonTimeRequest(
                school1.id(),
                LocalTime.of(10, 45),
                LocalTime.of(11, 30)
        ));

        LessonTimeResponse lessonTime5 = lessonTimeService.createLessonTime(new LessonTimeRequest(
                school1.id(),
                LocalTime.of(11, 50),
                LocalTime.of(12, 35)
        ));

        // ========== Tworzenie przykładowego administratora szkoły ==========
        schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "admin-sp1gdansk",
                "test123",
                "Jan",
                "Kowalski",
                UserRole.SCHOOL_ADMINISTRATOR
        ));

        // ========== Tworzenie przykładowych nauczycieli ==========
        SchoolMemberResponse teacher1 = schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "mmazur-sp1gdansk",
                "test123",
                "Marianna",
                "Mazur",
                UserRole.TEACHER
        ));

        SchoolMemberResponse teacher2 = schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "ckwiatkowski-sp1gdansk",
                "test123",
                "Cezary",
                "Kwiatkowski",
                UserRole.TEACHER
        ));

        SchoolMemberResponse teacher3 = schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "ewojciechowska-sp1gdansk",
                "test123",
                "Ewa",
                "Wojciechowska",
                UserRole.TEACHER
        ));

        SchoolMemberResponse teacher4 = schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "kmiller-sp1gdansk",
                "test123",
                "Krzysztof",
                "Miller",
                UserRole.TEACHER
        ));

        SchoolMemberResponse teacher5 = schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "mwisniewska-sp1gdansk",
                "test123",
                "Małgorzata",
                "Wiśniewska",
                UserRole.TEACHER
        ));

        // ========== Tworzenie przykładowych rodziców ==========
        SchoolMemberResponse parent1 = schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "kluczynska-sp1gdansk",
                "test123",
                "Kaja",
                "Łuczyńska",
                UserRole.PARENT
        ));

        SchoolMemberResponse parent2 = schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "dnagrodzka-sp1gdansk",
                "test123",
                "Daria",
                "Nagrodzka",
                UserRole.PARENT
        ));

        schoolMemberService.createSchoolMember(new SchoolMemberRequest(
                school1.id(),
                "dpytko-sp1gdansk",
                "test123",
                "Dariusz",
                "Pytko",
                UserRole.PARENT
        ));

        // ========== Tworzenie przykładowych klas szkolnych ==========
        SchoolClassResponse class1A = schoolClassService.createSchoolClass(new SchoolClassRequest(
                school1.id(),
                teacher1.userId(),
                "1A"
        ));

        SchoolClassResponse class1B = schoolClassService.createSchoolClass(new SchoolClassRequest(
                school1.id(),
                teacher2.userId(),
                "1B"
        ));

        SchoolClassResponse class1C = schoolClassService.createSchoolClass(new SchoolClassRequest(
                school1.id(),
                teacher3.userId(),
                "1C"
        ));

        // ========== Tworzenie przykładowych uczniów ==========
        StudentResponse student1 = studentService.createStudent(new StudentRequest(
                school1.id(),
                class1A.id(),
                parent1.userId(),
                "aluczynski-sp1gdansk",
                "test123",
                "Aleksander",
                "Łuczyński"
        ));

        StudentResponse student2 = studentService.createStudent(new StudentRequest(
                school1.id(),
                class1B.id(),
                parent1.userId(),
                "mluczynska-sp1gdansk",
                "test123",
                "Maja",
                "Łuczyńska"
        ));

        StudentResponse student3 = studentService.createStudent(new StudentRequest(
                school1.id(),
                class1A.id(),
                parent2.userId(),
                "knagrodzki-sp1gdansk",
                "test123",
                "Kacper",
                "Nagrocki"
        ));

        StudentResponse student4 = studentService.createStudent(new StudentRequest(
                school1.id(),
                class1C.id(),
                parent2.userId(),
                "mnagrodzka-sp1gdansk",
                "test123",
                "Martyna",
                "Nagrocka"
        ));

        StudentResponse student5 = studentService.createStudent(new StudentRequest(
                school1.id(),
                class1B.id(),
                parent2.userId(),
                "cnagrodzki-sp1gdansk",
                "test123",
                "Cezary",
                "Nagrocki"
        ));

        // ========== Tworzenie przykładowych lekcji ==========
        lessonService.createLesson(new LessonRequest(
                teacher4.userId(),
                class1A.id(),
                mathSubject.id(),
                "102",
                lessonTime1.id(),
                DayOfWeek.TUESDAY
        ));

        lessonService.createLesson(new LessonRequest(
                teacher5.userId(),
                class1A.id(),
                englishSubject.id(),
                "44",
                lessonTime2.id(),
                DayOfWeek.TUESDAY
        ));

        lessonService.createLesson(new LessonRequest(
                teacher3.userId(),
                class1A.id(),
                peSubject.id(),
                "Hala sportowa",
                lessonTime4.id(),
                DayOfWeek.FRIDAY
        ));

        lessonService.createLesson(new LessonRequest(
                teacher1.userId(),
                class1B.id(),
                itSubject.id(),
                "333",
                lessonTime2.id(),
                DayOfWeek.WEDNESDAY
        ));

        lessonService.createLesson(new LessonRequest(
                teacher4.userId(),
                class1B.id(),
                mathSubject.id(),
                "122",
                lessonTime3.id(),
                DayOfWeek.THURSDAY
        ));

        lessonService.createLesson(new LessonRequest(
                teacher2.userId(),
                class1B.id(),
                polishSubject.id(),
                "313",
                lessonTime5.id(),
                DayOfWeek.MONDAY
        ));

        lessonService.createLesson(new LessonRequest(
                teacher1.userId(),
                class1C.id(),
                itSubject.id(),
                "333",
                lessonTime3.id(),
                DayOfWeek.WEDNESDAY
        ));

        lessonService.createLesson(new LessonRequest(
                teacher2.userId(),
                class1C.id(),
                polishSubject.id(),
                "313",
                lessonTime4.id(),
                DayOfWeek.TUESDAY
        ));

        lessonService.createLesson(new LessonRequest(
                teacher4.userId(),
                class1C.id(),
                mathSubject.id(),
                "204",
                lessonTime1.id(),
                DayOfWeek.FRIDAY
        ));

        // ========== Tworzenie przykładowych ocen ==========
        gradeService.createGrade(new GradeRequest(
                student1.schoolMemberId(),
                teacher1.userId(),
                itSubject.id(),
                GradeValue.FIVE_MINUS,
                GradeType.REGULAR_SEMESTER_1,
                5,
                true,
                "Liczby binarne - kartkówka"
        ));

        gradeService.createGrade(new GradeRequest(
                student1.schoolMemberId(),
                teacher2.userId(),
                polishSubject.id(),
                GradeValue.FOUR,
                GradeType.REGULAR_SEMESTER_1,
                10,
                true,
                "Potop - test wiedzy"
        ));

        gradeService.createGrade(new GradeRequest(
                student1.schoolMemberId(),
                teacher4.userId(),
                mathSubject.id(),
                GradeValue.PLUS,
                GradeType.REGULAR_SEMESTER_1,
                1,
                true,
                "Aktywność na lekcji"
        ));

        gradeService.createGrade(new GradeRequest(
                student2.schoolMemberId(),
                teacher3.userId(),
                itSubject.id(),
                GradeValue.FIVE,
                GradeType.REGULAR_SEMESTER_1,
                5,
                true,
                "Bieg na 100m"
        ));

        gradeService.createGrade(new GradeRequest(
                student2.schoolMemberId(),
                teacher4.userId(),
                polishSubject.id(),
                GradeValue.TWO,
                GradeType.REGULAR_SEMESTER_1,
                10,
                true,
                "Stereometria - sprawdzian"
        ));

        gradeService.createGrade(new GradeRequest(
                student2.schoolMemberId(),
                teacher2.userId(),
                polishSubject.id(),
                GradeValue.NOT_PREPARED,
                GradeType.REGULAR_SEMESTER_1,
                1,
                true,
                "Brak lektury"
        ));

        gradeService.createGrade(new GradeRequest(
                student3.schoolMemberId(),
                teacher4.userId(),
                mathSubject.id(),
                GradeValue.FIVE_MINUS,
                GradeType.REGULAR_SEMESTER_1,
                5,
                true,
                "Trójkąty - kartkówka"
        ));

        gradeService.createGrade(new GradeRequest(
                student3.schoolMemberId(),
                teacher5.userId(),
                englishSubject.id(),
                GradeValue.FOUR,
                GradeType.REGULAR_SEMESTER_1,
                10,
                true,
                "Potop - test wiedzy"
        ));

        gradeService.createGrade(new GradeRequest(
                student3.schoolMemberId(),
                teacher4.userId(),
                mathSubject.id(),
                GradeValue.SIX_MINUS,
                GradeType.REGULAR_SEMESTER_1,
                10,
                true,
                "Trójkąty - sprawdzian"
        ));

        gradeService.createGrade(new GradeRequest(
                student4.schoolMemberId(),
                teacher3.userId(),
                peSubject.id(),
                GradeValue.NOT_PREPARED,
                GradeType.REGULAR_SEMESTER_1,
                1,
                true,
                "Brak stroju"
        ));

        gradeService.createGrade(new GradeRequest(
                student4.schoolMemberId(),
                teacher1.userId(),
                itSubject.id(),
                GradeValue.THREE,
                GradeType.REGULAR_SEMESTER_1,
                5,
                true,
                "Program w Scratchu"
        ));

        gradeService.createGrade(new GradeRequest(
                student4.schoolMemberId(),
                teacher2.userId(),
                polishSubject.id(),
                GradeValue.FOUR_PLUS,
                GradeType.REGULAR_SEMESTER_1,
                8,
                true,
                "Prezentacja projektu na lekcji"
        ));

        gradeService.createGrade(new GradeRequest(
                student5.schoolMemberId(),
                teacher3.userId(),
                peSubject.id(),
                GradeValue.FOUR_MINUS,
                GradeType.REGULAR_SEMESTER_1,
                10,
                true,
                "Aktywność przez semestr"
        ));

        gradeService.createGrade(new GradeRequest(
                student5.schoolMemberId(),
                teacher5.userId(),
                englishSubject.id(),
                GradeValue.FOUR,
                GradeType.REGULAR_SEMESTER_1,
                3,
                true,
                "Past Perfect - kartkówka"
        ));

        gradeService.createGrade(new GradeRequest(
                student5.schoolMemberId(),
                teacher2.userId(),
                polishSubject.id(),
                GradeValue.MINUS,
                GradeType.REGULAR_SEMESTER_1,
                1,
                true,
                "Brak pracy na lekcji"
        ));
    }
}
