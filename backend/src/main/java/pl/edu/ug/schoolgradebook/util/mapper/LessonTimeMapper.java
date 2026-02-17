package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeRequest;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeResponse;

@Component
public class LessonTimeMapper {
    public LessonTime mapRequestToEntity(LessonTimeRequest request, School school) {
        return LessonTime.builder()
                .school(school)
                .lessonStart(request.lessonStart())
                .lessonEnd(request.lessonEnd())
                .build();
    }

    public LessonTimeResponse mapEntityToResponse(LessonTime lessonTime) {
        return new LessonTimeResponse(
                lessonTime.getId(),
                lessonTime.getSchool().getId(),
                lessonTime.getLessonStart(),
                lessonTime.getLessonEnd()
        );
    }
}
