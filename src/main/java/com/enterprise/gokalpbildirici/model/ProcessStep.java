package com.enterprise.gokalpbildirici.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "process_steps")
public class ProcessStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    @JsonIgnoreProperties({"steps", "versions", "handler", "hibernateLazyInitializer"})
    private ProcessDefinition process;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private int stepOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role responsibleRole;

    @Column(columnDefinition = "TEXT")
    private String conditions;

    private String nextStepOnTrue;

    private String nextStepOnFalse;

    @Column(nullable = false)
    private boolean startNode;

    @Column(nullable = false)
    private boolean endNode;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ProcessDefinition getProcess() { return process; }
    public void setProcess(ProcessDefinition process) { this.process = process; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getStepOrder() { return stepOrder; }
    public void setStepOrder(int stepOrder) { this.stepOrder = stepOrder; }
    public Role getResponsibleRole() { return responsibleRole; }
    public void setResponsibleRole(Role responsibleRole) { this.responsibleRole = responsibleRole; }
    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }
    public String getNextStepOnTrue() { return nextStepOnTrue; }
    public void setNextStepOnTrue(String nextStepOnTrue) { this.nextStepOnTrue = nextStepOnTrue; }
    public String getNextStepOnFalse() { return nextStepOnFalse; }
    public void setNextStepOnFalse(String nextStepOnFalse) { this.nextStepOnFalse = nextStepOnFalse; }
    public boolean isStartNode() { return startNode; }
    public void setStartNode(boolean startNode) { this.startNode = startNode; }
    public boolean isEndNode() { return endNode; }
    public void setEndNode(boolean endNode) { this.endNode = endNode; }
}
