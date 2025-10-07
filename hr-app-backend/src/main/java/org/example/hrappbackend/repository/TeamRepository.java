package org.example.hrappbackend.repository;

import org.example.hrappbackend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
@Transactional
public interface TeamRepository extends JpaRepository<Team, UUID> {
}

