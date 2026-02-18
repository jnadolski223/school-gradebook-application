package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.*;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonRequest;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonResponse;

@Component
public class LessonMapper {
    public Lesson mapRequestToEntity(
            LessonRequest request,
            SchoolMember teacher,
            SchoolClass schoolClass,
            Subject subject,
            LessonTime lessonTime
    ) {
        return Lesson.builder()
                .teacher(teacher)
                .schoolClass(schoolClass)
                .subject(subject)
                .room(request.room())
                .lessonTime(lessonTime)
                .day(request.day())
                .build();
    }

    public LessonResponse mapEntityToResponse(Lesson lesson) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getTeacher().getUserId(),
                lesson.getSchoolClass().getId(),
                lesson.getSubject().getId(),
                lesson.getRoom(),
                lesson.getLessonTime().getId(),
                lesson.getDay()
        );
    }
}
