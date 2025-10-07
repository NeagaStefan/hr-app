package org.example.hrappbackend.repository;

import org.example.hrappbackend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByEmail(String email);

    default Optional<Employee> getEmployeeById(UUID id) {
        return findById(id);
    }

    default void deleteByIdEquals(UUID id) {
        deleteById(id);
    }

    List<Employee> findAllByManagerId(UUID managerId);
}