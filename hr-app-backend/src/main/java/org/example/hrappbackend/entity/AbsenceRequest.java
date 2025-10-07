package org.example.hrappbackend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "absence_requests")
public class AbsenceRequest {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AbsenceType type;

    @Column(length = 500)
    private String reason;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AbsenceStatus status;

    @ManyToOne
    @JoinColumn(name = "approved_by_id")
    private Employee approvedBy;

    @Column
    private LocalDateTime requestedAt;

    @Column
    private LocalDateTime respondedAt;

    @Column(length = 500)
    private String managerComment;

    public enum AbsenceType {
        VACATION,
        SICK_LEAVE,
        PERSONAL,
        UNPAID
    }

    public enum AbsenceStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}