package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonTimeService extends EntityService {
    private final LessonTimeRepository lessonTimeRepository;
    private final SchoolRepository schoolRepository;
    private final LessonTimeMapper mapper;

    @Transactional
    public LessonTimeResponse createLessonTime(LessonTimeRequest request) {
        School school = getOrThrow(schoolRepository, School.class, request.schoolId());

        validateLessonTime(school, request.lessonStart(), request.lessonEnd());

        LessonTime lessonTime = mapper.mapRequestToEntity(request, school);
        return mapper.mapEntityToResponse(lessonTimeRepository.save(lessonTime));
    }

    public LessonTimeResponse getLessonTimeById(UUID lessonTimeId) {
        LessonTime lessonTime = getOrThrow(lessonTimeRepository, LessonTime.class, lessonTimeId);
        return mapper.mapEntityToResponse(lessonTime);
    }

    public List<LessonTimeResponse> getAllLessonTimesBySchoolId(UUID schoolId) {
        return lessonTimeRepository
                .findBySchool_Id(schoolId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public LessonTimeResponse updateLessonTime(UUID lessonTimeId, LessonTimeUpdateRequest request) {
        LessonTime lessonTime = getOrThrow(lessonTimeRepository, LessonTime.class, lessonTimeId);

        validateLessonTimeForUpdate(lessonTime.getSchool(), lessonTimeId, request.lessonStart(), request.lessonEnd());

        lessonTime.setLessonStart(request.lessonStart());
        lessonTime.setLessonEnd(request.lessonEnd());
        return mapper.mapEntityToResponse(lessonTime);
    }

    @Transactional
    public void deleteLessonTime(UUID lessonTimeId) {
        LessonTime lessonTime = getOrThrow(lessonTimeRepository, LessonTime.class, lessonTimeId);
        lessonTimeRepository.delete(lessonTime);
    }

    private void validateLessonTime(School school, LocalTime start, LocalTime end) {
        if (!start.isBefore(end)) {
            throw new ConflictException("Lesson start must be before lesson end");
        }
        if (lessonTimeRepository.existsOverlappingLessonTime(school, start, end)) {
            throw new ConflictException("Lesson time overlaps with existing lesson");
        }
    }

    private void validateLessonTimeForUpdate(School school, UUID lessonTimeId, LocalTime start, LocalTime end) {
        if (!start.isBefore(end)) {
            throw new ConflictException("Lesson start must be before lesson end");
        }

        if (lessonTimeRepository.existsOverlappingLessonTimeForUpdate(school, lessonTimeId, start, end)) {
            throw new ConflictException("Lesson time overlaps with existing lesson");
        }
    }
}
