package com.enterprise.gokalpbildirici.controller;

import com.enterprise.gokalpbildirici.model.BusinessRule;
import com.enterprise.gokalpbildirici.service.BusinessRuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
@CrossOrigin(origins = "*")
public class BusinessRuleController {

    private final BusinessRuleService ruleService;

    public BusinessRuleController(BusinessRuleService ruleService) {
        this.ruleService = ruleService;
    }

    @GetMapping
    public List<BusinessRule> getAllRules() {
        return ruleService.getAllRules();
    }

    @GetMapping("/process/{processId}")
    public List<BusinessRule> getRulesByProcess(@PathVariable Long processId) {
        return ruleService.getRulesByProcess(processId);
    }

    @GetMapping("/{id}")
    public BusinessRule getRule(@PathVariable Long id) {
        return ruleService.getRule(id);
    }

    @PostMapping
    public BusinessRule createRule(@RequestBody BusinessRule rule) {
        return ruleService.createRule(rule);
    }

    @PutMapping("/{id}")
    public BusinessRule updateRule(@PathVariable Long id, @RequestBody BusinessRule rule) {
        return ruleService.updateRule(id, rule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Long id) {
        ruleService.deleteRule(id);
        return ResponseEntity.noContent().build();
    }
}
