package com.enterprise.gokalpbildirici.controller;

import com.enterprise.gokalpbildirici.model.*;
import com.enterprise.gokalpbildirici.service.ProcessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/processes")
@CrossOrigin(origins = "*")
public class ProcessController {

    private final ProcessService processService;

    public ProcessController(ProcessService processService) {
        this.processService = processService;
    }

    @GetMapping
    public List<ProcessDefinition> getAllProcesses() {
        return processService.getAllProcesses();
    }

    @GetMapping("/{id}")
    public ProcessDefinition getProcess(@PathVariable Long id) {
        return processService.getProcess(id);
    }

    @PostMapping
    public ProcessDefinition createProcess(@RequestBody ProcessDefinition process) {
        return processService.createProcess(process);
    }

    @PutMapping("/{id}")
    public ProcessDefinition updateProcess(@PathVariable Long id, @RequestBody ProcessDefinition process) {
        return processService.updateProcess(id, process);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id) {
        processService.deleteProcess(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/versions")
    public ProcessDefinition createVersion(@PathVariable Long id,
                                  @RequestParam String changedBy,
                                  @RequestParam String description) {
        return processService.createNewVersion(id, changedBy, description);
    }

    @GetMapping("/{id}/versions")
    public List<ProcessVersion> getVersions(@PathVariable Long id) {
        return processService.getVersions(id);
    }

    @PostMapping("/{id}/versions/{versionId}/restore")
    public ProcessDefinition restoreVersion(@PathVariable Long id, @PathVariable Long versionId) {
        return processService.restoreVersion(id, versionId);
    }

    @GetMapping("/{id}/steps")
    public List<ProcessStep> getSteps(@PathVariable Long id) {
        return processService.getSteps(id);
    }

    @PostMapping("/{id}/steps")
    public ProcessStep addStep(@PathVariable Long id, @RequestBody ProcessStep step) {
        return processService.addStep(id, step);
    }

    @DeleteMapping("/{processId}/steps/{stepId}")
    public ResponseEntity<Void> deleteStep(@PathVariable Long processId, @PathVariable Long stepId) {
        processService.deleteStep(stepId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/logs")
    public List<ActivityLog> getLogs(@PathVariable Long id) {
        return processService.getProcessLogs(id);
    }
}
