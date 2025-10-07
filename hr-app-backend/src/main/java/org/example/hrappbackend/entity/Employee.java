package org.example.hrappbackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.example.hrappbackend.dto.EmployeeDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String position;
    private String department;
    private LocalDate hireDate;
    private BigDecimal salary;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @ManyToMany(mappedBy = "employees")
    private Set<Team> teams;

    public EmployeeDTO toDTO() {
        String managerFullName = null;
        if (this.manager != null) {
            managerFullName = this.manager.getFirstName() + " " + this.manager.getLastName();
        }

        return new EmployeeDTO(
                this.id,
                this.firstName,
                this.lastName,
                this.email,
                this.position,
                this.department,
                this.hireDate,
                this.salary,
                this.manager != null ? this.manager.getId() : null,
                managerFullName,
                this.teams != null ? this.teams.stream().map(Team::getId).toList() : null
        );
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Employee employee)) return false;
        return id != null && id.equals(employee.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}