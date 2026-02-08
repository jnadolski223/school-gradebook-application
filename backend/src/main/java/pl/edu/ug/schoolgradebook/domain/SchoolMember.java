package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "school_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolMember {

    @Id
    @Column(name = "user_id")
    @Setter(AccessLevel.NONE)
    private UUID userId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "school_id")
    private School school;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;
}
