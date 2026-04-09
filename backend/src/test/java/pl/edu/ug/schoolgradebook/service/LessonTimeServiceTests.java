package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeRequest;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeResponse;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeUpdateRequest;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.LessonTimeRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.util.mapper.LessonTimeMapper;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LessonTimeServiceTests {

    @Mock
    private LessonTimeRepository lessonTimeRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private LessonTimeMapper mapper;

    @InjectMocks
    private LessonTimeService service;

    private UUID schoolId;
    private School school;

    private UUID id;
    private LessonTimeRequest request;
    private LessonTime lessonTime;
    private LessonTimeResponse response;

    @BeforeEach
    void setUp() {
        schoolId = UUID.randomUUID();
        school = School.builder().id(schoolId).build();

        id = UUID.randomUUID();
        request = new LessonTimeRequest(
                schoolId,
                LocalTime.of(8, 0),
                LocalTime.of(8, 45)
        );
        lessonTime = LessonTime.builder()
                .id(id)
                .school(school)
                .lessonStart(request.lessonStart())
                .lessonEnd(request.lessonEnd())
                .build();
        response = new LessonTimeResponse(
                lessonTime.getId(),
                lessonTime.getSchool().getId(),
                lessonTime.getLessonStart(),
                lessonTime.getLessonEnd()
        );
    }

    @Test
    @DisplayName("Should create lesson time")
    void shouldCreateLessonTime() {
        // Given
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(lessonTimeRepository.existsOverlappingLessonTime(school, request.lessonStart(), request.lessonEnd())).thenReturn(false);
        when(mapper.mapRequestToEntity(request, school)).thenReturn(lessonTime);
        when(lessonTimeRepository.save(lessonTime)).thenReturn(lessonTime);
        when(mapper.mapEntityToResponse(lessonTime)).thenReturn(response);

        // When
        LessonTimeResponse result = service.createLessonTime(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(lessonTimeRepository).save(lessonTime);
    }

    @Test
    @DisplayName("Should throw ConflictException if end time is before start time (Create)")
    void shouldThrowExceptionIfEndTimeIsBeforeStartTimeCreate() {
        // Given
        LessonTimeRequest invalidRequest = new LessonTimeRequest(
                schoolId,
                LocalTime.of(8, 45),
                LocalTime.of(8, 0)
        );
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));

        // When & Then
        assertThrows(ConflictException.class, () -> service.createLessonTime(invalidRequest));
    }

    @Test
    @DisplayName("Should throw ConflictException if lesson time overlaps with another (Create)")
    void shouldThrowExceptionIfLessonTimeOverlapsWithAnotherCreate() {
        // Given
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(lessonTimeRepository.existsOverlappingLessonTime(school, request.lessonStart(), request.lessonEnd())).thenReturn(true);

        // When & Then
        assertThrows(ConflictException.class, () -> service.createLessonTime(request));
    }

    @Test
    @DisplayName("Should return lesson time by ID")
    void shouldReturnLessonTimeById() {
        // Given
        when(lessonTimeRepository.findById(id)).thenReturn(Optional.of(lessonTime));
        when(mapper.mapEntityToResponse(lessonTime)).thenReturn(response);

        // When
        LessonTimeResponse result = service.getLessonTimeById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(lessonTimeRepository).findById(id);
    }

    @Test
    @DisplayName("Should return all lesson times with given schoolId")
    void shouldReturnAllLessonTimesWithGivenSchoolId() {
        // Given
        List<LessonTime> lessonTimes = List.of(lessonTime, lessonTime);
        when(lessonTimeRepository.findBySchool_Id(schoolId)).thenReturn(lessonTimes);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<LessonTimeResponse> results = service.getAllLessonTimesBySchoolId(schoolId);

        // Then
        assertThat(results).hasSize(2);
        verify(lessonTimeRepository).findBySchool_Id(schoolId);
    }

    @Test
    @DisplayName("Should update lesson time")
    void shouldUpdateLessonTime() {
        // Given
        LessonTimeUpdateRequest updatedLessonTime = new LessonTimeUpdateRequest(
                LocalTime.of(8, 0),
                LocalTime.of(8, 30)
        );
        when(lessonTimeRepository.findById(id)).thenReturn(Optional.of(lessonTime));
        when(lessonTimeRepository.existsOverlappingLessonTimeForUpdate(school, id, updatedLessonTime.lessonStart(), updatedLessonTime.lessonEnd())).thenReturn(false);
        when(mapper.mapEntityToResponse(lessonTime)).thenReturn(response);

        // When
        service.updateLessonTime(id, updatedLessonTime);

        // Then
        assertThat(lessonTime.getLessonStart()).isEqualTo(updatedLessonTime.lessonStart());
        assertThat(lessonTime.getLessonEnd()).isEqualTo(updatedLessonTime.lessonEnd());
    }

    @Test
    @DisplayName("Should throw ConflictException if end time is before start time (Update)")
    void shouldThrowExceptionIfEndTimeIsBeforeStartTimeUpdate() {
        // Given
        LessonTimeUpdateRequest updatedLessonTime = new LessonTimeUpdateRequest(
                LocalTime.of(8, 30),
                LocalTime.of(8, 0)
        );
        when(lessonTimeRepository.findById(id)).thenReturn(Optional.of(lessonTime));

        // When & Then
        assertThrows(ConflictException.class, () -> service.updateLessonTime(id, updatedLessonTime));
    }

    @Test
    @DisplayName("Should throw ConflictException if lesson time overlaps with another (Update)")
    void shouldThrowExceptionIfLessonTimeOverlapsWithAnotherUpdate() {
        // Given
        LessonTimeUpdateRequest updatedLessonTime = new LessonTimeUpdateRequest(
                LocalTime.of(8, 0),
                LocalTime.of(8, 30)
        );
        when(lessonTimeRepository.findById(id)).thenReturn(Optional.of(lessonTime));
        when(lessonTimeRepository.existsOverlappingLessonTimeForUpdate(school, id, updatedLessonTime.lessonStart(), updatedLessonTime.lessonEnd())).thenReturn(true);

        // When & Then
        assertThrows(ConflictException.class, () -> service.updateLessonTime(id, updatedLessonTime));
    }

    @Test
    @DisplayName("Should delete lesson time by ID")
    void shouldDeleteLessonTimeById() {
        // Given
        when(lessonTimeRepository.findById(id)).thenReturn(Optional.of(lessonTime));

        // When
        service.deleteLessonTime(id);

        // Then
        verify(lessonTimeRepository).delete(lessonTime);
    }
}
