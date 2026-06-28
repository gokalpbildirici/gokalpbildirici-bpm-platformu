package com.enterprise.gokalpbildirici.repository;

import com.enterprise.gokalpbildirici.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByProcessIdOrderByTimestampDesc(Long processId);
    List<ActivityLog> findAllByOrderByTimestampDesc();
}
