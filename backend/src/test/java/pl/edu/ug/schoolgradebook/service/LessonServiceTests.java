package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.*;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonRequest;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonResponse;
import pl.edu.ug.schoolgradebook.enums.DayOfWeek;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.*;
import pl.edu.ug.schoolgradebook.util.mapper.LessonMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LessonServiceTests {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private SchoolMemberRepository schoolMemberRepository;

    @Mock
    private SchoolClassRepository schoolClassRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private LessonTimeRepository lessonTimeRepository;

    @Mock
    private LessonMapper mapper;

    @InjectMocks
    private LessonService service;

    private UUID schoolMemberId;
    private SchoolMember schoolMember;

    private UUID schoolClassId;
    private SchoolClass schoolClass;

    private UUID subjectId;
    private Subject subject;

    private UUID lessonTimeId;
    private LessonTime lessonTime;

    private UUID id;
    private LessonRequest request;
    private Lesson lesson;
    private LessonResponse response;

    @BeforeEach
    void setUp() {
        schoolMemberId = UUID.randomUUID();
        schoolMember = SchoolMember.builder().userId(schoolMemberId).build();

        schoolClassId = UUID.randomUUID();
        schoolClass = SchoolClass.builder().id(schoolClassId).build();

        subjectId = UUID.randomUUID();
        subject = Subject.builder().id(subjectId).build();

        lessonTimeId = UUID.randomUUID();
        lessonTime = LessonTime.builder().id(lessonTimeId).build();

        id = UUID.randomUUID();
        request = new LessonRequest(
                schoolMemberId,
                schoolClassId,
                subjectId,
                "100A",
                lessonTimeId,
                DayOfWeek.MONDAY
        );
        lesson = Lesson.builder()
                .id(id)
                .teacher(schoolMember)
                .schoolClass(schoolClass)
                .subject(subject)
                .room(request.room())
                .lessonTime(lessonTime)
                .day(request.day())
                .build();
        response = new LessonResponse(
                lesson.getId(),
                lesson.getTeacher().getUserId(),
                lesson.getSchoolClass().getId(),
                lesson.getSubject().getId(),
                lesson.getRoom(),
                lesson.getLessonTime().getId(),
                lesson.getDay()
        );
    }

    @Test
    @DisplayName("Should create lesson")
    void shouldCreateLesson() {
        // Given
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(schoolClassRepository.findById(schoolClassId)).thenReturn(Optional.of(schoolClass));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(lessonTimeRepository.findById(lessonTimeId)).thenReturn(Optional.of(lessonTime));
        when(lessonRepository.findBySchoolClassAndLessonTimeAndDay(schoolClass, lessonTime, request.day())).thenReturn(Optional.empty());
        when(mapper.mapRequestToEntity(request, schoolMember, schoolClass, subject, lessonTime)).thenReturn(lesson);
        when(lessonRepository.save(lesson)).thenReturn(lesson);
        when(mapper.mapEntityToResponse(lesson)).thenReturn(response);

        // When
        LessonResponse result = service.createLesson(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(lessonRepository).save(lesson);
    }

    @Test
    @DisplayName("Should throw ConflictException if lesson is created on chosen day, lesson time and for school class")
    void shouldThrowExceptionWhenLessonIsAlreadyCreated() {
        // Given
        Lesson fakeLesson = Lesson.builder().id(UUID.randomUUID()).build();
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(schoolClassRepository.findById(schoolClassId)).thenReturn(Optional.of(schoolClass));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(lessonTimeRepository.findById(lessonTimeId)).thenReturn(Optional.of(lessonTime));
        when(lessonRepository.findBySchoolClassAndLessonTimeAndDay(schoolClass, lessonTime, request.day())).thenReturn(Optional.of(fakeLesson));

        // When & Then
        assertThrows(ConflictException.class, () -> service.createLesson(request));
    }

    @Test
    @DisplayName("Should return lesson by ID")
    void shouldReturnLessonById() {
        // Given
        when(lessonRepository.findById(id)).thenReturn(Optional.of(lesson));
        when(mapper.mapEntityToResponse(lesson)).thenReturn(response);

        // When
        LessonResponse result = service.getLessonById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(lessonRepository).findById(id);
    }

    @Test
    @DisplayName("Should return all lessons")
    void shouldReturnAllLessons() {
        // Given
        List<Lesson> lessons = List.of(lesson, lesson);
        when(lessonRepository.findAll()).thenReturn(lessons);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<LessonResponse> results = service.getAllLessons();

        // Then
        assertThat(results).hasSize(2);
        verify(lessonRepository).findAll();
    }

    @Test
    @DisplayName("Should return all lessons with given schoolClassId")
    void shouldReturnAllLessonsBySchoolClassId() {
        // Given
        List<Lesson> lessons = List.of(lesson, lesson);
        when(lessonRepository.findBySchoolClass_Id(schoolClassId)).thenReturn(lessons);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<LessonResponse> results = service.getAllLessonsBySchoolClassId(schoolClassId);

        // Then
        assertThat(results).hasSize(2);
        verify(lessonRepository).findBySchoolClass_Id(schoolClassId);
    }

    @Test
    @DisplayName("Should return all lessons with given teacherId")
    void shouldReturnAllLessonsByTeacherId() {
        // Given
        List<Lesson> lessons = List.of(lesson, lesson);
        when(lessonRepository.findByTeacher_UserId(schoolMemberId)).thenReturn(lessons);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<LessonResponse> results = service.getAllLessonsByTeacherId(schoolMemberId);

        // Then
        assertThat(results).hasSize(2);
        verify(lessonRepository).findByTeacher_UserId(schoolMemberId);
    }

    @Test
    @DisplayName("Should update lesson data")
    void shouldUpdateLesson() {
        // Given
        request = new LessonRequest(
                schoolMemberId,
                schoolClassId,
                subjectId,
                "220C",
                lessonTimeId,
                DayOfWeek.FRIDAY
        );
        when(lessonRepository.findById(id)).thenReturn(Optional.of(lesson));
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(schoolClassRepository.findById(schoolClassId)).thenReturn(Optional.of(schoolClass));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(lessonTimeRepository.findById(lessonTimeId)).thenReturn(Optional.of(lessonTime));
        when(lessonRepository.findBySchoolClassAndLessonTimeAndDay(schoolClass, lessonTime, request.day())).thenReturn(Optional.empty());
        when(mapper.mapEntityToResponse(lesson)).thenReturn(response);

        // When
        service.updateLesson(id, request);

        // Then
        assertThat(lesson.getRoom()).isEqualTo(request.room());
        assertThat(lesson.getDay()).isEqualTo(request.day());
    }

    @Test
    @DisplayName("Should throw ConflictException if cannot update lesson")
    void shouldThrowExceptionIfCannotUpdateLesson() {
        // Given
        UUID lessonIdToUpdate = UUID.randomUUID();
        when(lessonRepository.findById(lessonIdToUpdate)).thenReturn(Optional.of(Lesson.builder().id(lessonIdToUpdate).build()));
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(schoolClassRepository.findById(schoolClassId)).thenReturn(Optional.of(schoolClass));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(lessonTimeRepository.findById(lessonTimeId)).thenReturn(Optional.of(lessonTime));
        when(lessonRepository.findBySchoolClassAndLessonTimeAndDay(schoolClass, lessonTime, request.day())).thenReturn(Optional.of(lesson));

        // When & Then
        assertThrows(ConflictException.class, () -> service.updateLesson(lessonIdToUpdate, request));
    }

    @Test
    @DisplayName("Should delete lesson by ID")
    void shouldDeleteLessonById() {
        // Given
        when(lessonRepository.findById(id)).thenReturn(Optional.of(lesson));

        // When
        service.deleteLesson(id);

        // Then
        verify(lessonRepository).delete(lesson);
    }
}
