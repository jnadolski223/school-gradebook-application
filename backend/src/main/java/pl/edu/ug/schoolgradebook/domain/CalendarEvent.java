package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.ug.schoolgradebook.enums.CalendarEventType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "calendar_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sender_id")
    private SchoolMember sender;

    @ManyToOne
    @JoinColumn(name = "recipient_class_id")
    private SchoolClass recipientClass;

    @ManyToOne(optional = false)
    @JoinColumn(name = "recipient_school_id")
    private School recipientSchool;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CalendarEventType type;

    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    @Column(nullable = false)
    private LocalDate eventDate;
}
