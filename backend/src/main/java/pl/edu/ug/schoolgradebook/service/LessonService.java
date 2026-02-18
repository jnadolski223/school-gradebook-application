package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.*;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonRequest;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonResponse;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.*;
import pl.edu.ug.schoolgradebook.util.mapper.LessonMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonService extends EntityService {
    private final LessonRepository lessonRepository;
    private final SchoolMemberRepository schoolMemberRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final LessonTimeRepository lessonTimeRepository;
    private final LessonMapper mapper;

    @Transactional
    public LessonResponse createLesson(LessonRequest request) {
        SchoolMember teacher = getOrThrow(schoolMemberRepository, SchoolMember.class, request.teacherId());
        SchoolClass schoolClass = getOrThrow(schoolClassRepository, SchoolClass.class, request.schoolClassId());
        Subject subject = getOrThrow(subjectRepository, Subject.class, request.subjectId());
        LessonTime lessonTime = getOrThrow(lessonTimeRepository, LessonTime.class, request.lessonTimeId());

        if (lessonRepository.findBySchoolClassAndLessonTimeAndDay(schoolClass, lessonTime, request.day()).isPresent()) {
            throw new ConflictException("Lesson is already created for this school class, lesson time and day");
        }

        Lesson lesson = mapper.mapRequestToEntity(request, teacher, schoolClass, subject, lessonTime);
        return mapper.mapEntityToResponse(lessonRepository.save(lesson));
    }

    public LessonResponse getLessonById(UUID lessonId) {
        Lesson lesson = getOrThrow(lessonRepository, Lesson.class, lessonId);
        return mapper.mapEntityToResponse(lesson);
    }

    public List<LessonResponse> getAllLessons() {
        return lessonRepository
                .findAll()
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<LessonResponse> getAllLessonsBySchoolClassId(UUID schoolClassId) {
        return lessonRepository
                .findBySchoolClass_Id(schoolClassId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<LessonResponse> getAllLessonsByTeacherId(UUID teacherId) {
        return lessonRepository
                .findByTeacher_UserId(teacherId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public LessonResponse updateLesson(UUID lessonId, LessonRequest request) {
        Lesson lesson = getOrThrow(lessonRepository, Lesson.class, lessonId);
        SchoolMember teacher = getOrThrow(schoolMemberRepository, SchoolMember.class, request.teacherId());
        SchoolClass schoolClass = getOrThrow(schoolClassRepository, SchoolClass.class, request.schoolClassId());
        Subject subject = getOrThrow(subjectRepository, Subject.class, request.subjectId());
        LessonTime lessonTime = getOrThrow(lessonTimeRepository, LessonTime.class, request.lessonTimeId());
        Optional<Lesson> existingLesson = lessonRepository.findBySchoolClassAndLessonTimeAndDay(schoolClass, lessonTime, request.day());

        if (existingLesson.isPresent() && existingLesson.get().getId() != lessonId) {
            throw new ConflictException("Lesson is already created for this school class, lesson time and day");
        }

        lesson.setTeacher(teacher);
        lesson.setSchoolClass(schoolClass);
        lesson.setSubject(subject);
        lesson.setRoom(request.room());
        lesson.setLessonTime(lessonTime);
        lesson.setDay(request.day());

        return mapper.mapEntityToResponse(lesson);
    }

    @Transactional
    public void deleteLesson(UUID lessonId) {
        Lesson lesson = getOrThrow(lessonRepository, Lesson.class, lessonId);
        lessonRepository.delete(lesson);
    }
}