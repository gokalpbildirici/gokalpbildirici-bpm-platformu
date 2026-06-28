package com.enterprise.gokalpbildirici.repository;

import com.enterprise.gokalpbildirici.model.ProcessDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcessRepository extends JpaRepository<ProcessDefinition, Long> {
    List<ProcessDefinition> findByActiveTrue();
    Optional<ProcessDefinition> findByNameAndVersion(String name, int version);
    List<ProcessDefinition> findByNameOrderByVersionDesc(String name);
}
