package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "school_classes")
@Getter
@Setter
@ToString(exclude = {"school", "homeroomTeacher"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class SchoolClass {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    private School school;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private SchoolMember homeroomTeacher;

    private String name;
}
