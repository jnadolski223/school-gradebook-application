package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @Column(name = "user_id")
    @Setter(AccessLevel.NONE)
    private UUID userId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id")
    private SchoolMember schoolMember;

    @ManyToOne(optional = false)
    @JoinColumn(name = "parent_id")
    private SchoolMember parent;

    @ManyToOne(optional = false)
    private SchoolClass schoolClass;
}
