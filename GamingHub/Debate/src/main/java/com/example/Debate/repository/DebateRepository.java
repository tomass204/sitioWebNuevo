package com.example.Debate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Debate.model.Debate;

import java.util.List;

@Repository
public interface DebateRepository extends JpaRepository<Debate, Long> {
    List<Debate> findByActivoTrue();
    List<Debate> findByCerradoFalse();
}
