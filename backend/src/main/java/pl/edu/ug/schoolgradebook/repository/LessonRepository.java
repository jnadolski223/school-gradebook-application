package pl.edu.ug.schoolgradebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.ug.schoolgradebook.domain.Lesson;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.SchoolClass;
import pl.edu.ug.schoolgradebook.enums.DayOfWeek;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findBySchoolClass_Id(UUID schoolClassId);

    List<Lesson> findByTeacher_UserId(UUID teacherId);

    Optional<Lesson> findBySchoolClassAndLessonTimeAndDay(SchoolClass schoolClass, LessonTime lessonTime, DayOfWeek day);
}
