package com.enterprise.gokalpbildirici.repository;

import com.enterprise.gokalpbildirici.model.BusinessRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessRuleRepository extends JpaRepository<BusinessRule, Long> {
    List<BusinessRule> findByProcessId(Long processId);
    List<BusinessRule> findByActiveTrue();
}
