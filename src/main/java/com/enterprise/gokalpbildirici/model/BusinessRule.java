package com.enterprise.gokalpbildirici.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "business_rules")
public class BusinessRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String condition;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String action;

    @Column(nullable = false)
    private boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id")
    @JsonIgnoreProperties({"steps", "versions", "handler", "hibernateLazyInitializer"})
    private ProcessDefinition process;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public ProcessDefinition getProcess() { return process; }
    public void setProcess(ProcessDefinition process) { this.process = process; }
}
