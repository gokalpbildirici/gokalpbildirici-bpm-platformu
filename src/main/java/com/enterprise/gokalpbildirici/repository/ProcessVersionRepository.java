package com.enterprise.gokalpbildirici.repository;

import com.enterprise.gokalpbildirici.model.ProcessVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcessVersionRepository extends JpaRepository<ProcessVersion, Long> {
    List<ProcessVersion> findByProcessIdOrderByVersionNumberDesc(Long processId);
}
