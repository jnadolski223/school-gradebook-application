package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.ug.schoolgradebook.enums.DayOfWeek;

import java.util.UUID;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@ToString(exclude = {"teacher", "schoolClass", "subject", "lessonTime"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    private SchoolMember teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.LAZY)
    private Subject subject;

    String room;

    @ManyToOne(fetch = FetchType.LAZY)
    LessonTime lessonTime;

    @Enumerated(EnumType.STRING)
    DayOfWeek day;
}
