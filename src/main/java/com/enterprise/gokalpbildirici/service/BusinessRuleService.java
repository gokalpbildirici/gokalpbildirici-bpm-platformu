package com.enterprise.gokalpbildirici.service;

import com.enterprise.gokalpbildirici.model.BusinessRule;
import com.enterprise.gokalpbildirici.repository.BusinessRuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BusinessRuleService {

    private final BusinessRuleRepository ruleRepository;

    public BusinessRuleService(BusinessRuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    public List<BusinessRule> getAllRules() {
        return ruleRepository.findAll();
    }

    public List<BusinessRule> getRulesByProcess(Long processId) {
        return ruleRepository.findByProcessId(processId);
    }

    public BusinessRule getRule(Long id) {
        return ruleRepository.findById(id).orElseThrow();
    }

    public BusinessRule createRule(BusinessRule rule) {
        return ruleRepository.save(rule);
    }

    public BusinessRule updateRule(Long id, BusinessRule updated) {
        BusinessRule rule = getRule(id);
        rule.setName(updated.getName());
        rule.setDescription(updated.getDescription());
        rule.setCondition(updated.getCondition());
        rule.setAction(updated.getAction());
        rule.setActive(updated.isActive());
        return ruleRepository.save(rule);
    }

    public void deleteRule(Long id) {
        ruleRepository.deleteById(id);
    }
}
