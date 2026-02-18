package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@ToString(exclude = {"schoolMember", "parent", "schoolClass"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Student {
    @Id
    @Setter(AccessLevel.NONE)
    private UUID schoolMemberId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    private SchoolMember schoolMember;

    @ManyToOne(fetch = FetchType.LAZY)
    private SchoolMember parent;

    @ManyToOne(fetch = FetchType.LAZY)
    private SchoolClass schoolClass;

}
