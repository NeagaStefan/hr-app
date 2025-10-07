package org.example.hrappbackend.repository;

import org.example.hrappbackend.entity.AbsenceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
@Transactional
public interface AbsenceRequestRepository extends JpaRepository<AbsenceRequest, UUID> {

    List<AbsenceRequest> findByEmployeeIdOrderByRequestedAtDesc(UUID employeeId);

    @Query("SELECT a FROM AbsenceRequest a WHERE a.employee.manager.id = :managerId ORDER BY a.requestedAt DESC")
    List<AbsenceRequest> findByManagerId(@Param("managerId") UUID managerId);
}

