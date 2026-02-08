package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "school_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "school_id")
    private School school;

    @OneToOne(optional = false)
    @JoinColumn(name = "homeroom_teacher_id", unique = true)
    private SchoolMember homeroomTeacher;

    @Column(nullable = false)
    private String name;
}
