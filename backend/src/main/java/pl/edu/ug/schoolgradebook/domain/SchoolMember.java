package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "school_members")
@Getter
@Setter
@ToString(exclude = {"user", "school"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class SchoolMember {
    @Id
    @Setter(AccessLevel.NONE)
    private UUID userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private School school;

    private String firstName;
    private String lastName;
}
