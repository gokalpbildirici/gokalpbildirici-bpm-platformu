package com.enterprise.gokalpbildirici.service;

import com.enterprise.gokalpbildirici.model.*;
import com.enterprise.gokalpbildirici.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ProcessService {

    private final ProcessRepository processRepository;
    private final ProcessStepRepository stepRepository;
    private final ProcessVersionRepository versionRepository;
    private final ActivityLogRepository logRepository;

    public ProcessService(ProcessRepository processRepository,
                          ProcessStepRepository stepRepository,
                          ProcessVersionRepository versionRepository,
                          ActivityLogRepository logRepository) {
        this.processRepository = processRepository;
        this.stepRepository = stepRepository;
        this.versionRepository = versionRepository;
        this.logRepository = logRepository;
    }

    public List<ProcessDefinition> getAllProcesses() {
        return processRepository.findAll();
    }

    public List<ProcessDefinition> getActiveProcesses() {
        return processRepository.findByActiveTrue();
    }

    public ProcessDefinition getProcess(Long id) {
        return processRepository.findById(id).orElseThrow();
    }

    public ProcessDefinition createProcess(ProcessDefinition process) {
        process.setCreatedAt(LocalDateTime.now());
        process.setVersion(1);
        process.setActive(true);
        ProcessDefinition saved = processRepository.save(process);
        logActivity(saved, "SYSTEM", "PROCESS_CREATED", "Süreç oluşturuldu: " + saved.getName());
        createVersionSnapshot(saved, "SYSTEM", "İlk versiyon");
        return saved;
    }

    public ProcessDefinition updateProcess(Long id, ProcessDefinition updated) {
        ProcessDefinition process = getProcess(id);
        process.setName(updated.getName());
        process.setDescription(updated.getDescription());
        process.setUpdatedAt(LocalDateTime.now());
        ProcessDefinition saved = processRepository.save(process);
        logActivity(saved, "SYSTEM", "PROCESS_UPDATED", "Süreç güncellendi: " + saved.getName());
        return saved;
    }

    public ProcessDefinition createNewVersion(Long id, String changedBy, String changeDescription) {
        ProcessDefinition process = getProcess(id);
        process.setVersion(process.getVersion() + 1);
        process.setUpdatedAt(LocalDateTime.now());
        ProcessDefinition saved = processRepository.save(process);
        createVersionSnapshot(saved, changedBy, changeDescription);
        logActivity(saved, changedBy, "VERSION_CREATED", "Yeni versiyon: v" + saved.getVersion());
        return saved;
    }

    public void deleteProcess(Long id) {
        ProcessDefinition process = getProcess(id);
        process.setActive(false);
        processRepository.save(process);
        logActivity(process, "SYSTEM", "PROCESS_DEACTIVATED", "Süreç devre dışı");
    }

    public ProcessStep addStep(Long processId, ProcessStep step) {
        ProcessDefinition process = getProcess(processId);
        step.setProcess(process);
        ProcessStep saved = stepRepository.save(step);
        logActivity(process, "SYSTEM", "STEP_ADDED", "Adım eklendi: " + saved.getName());
        return saved;
    }

    public List<ProcessStep> getSteps(Long processId) {
        return stepRepository.findByProcessIdOrderByStepOrderAsc(processId);
    }

    public void deleteStep(Long stepId) {
        stepRepository.deleteById(stepId);
    }

    public List<ProcessVersion> getVersions(Long processId) {
        return versionRepository.findByProcessIdOrderByVersionNumberDesc(processId);
    }

    public ProcessVersion getVersion(Long versionId) {
        return versionRepository.findById(versionId).orElseThrow();
    }

    public ProcessDefinition restoreVersion(Long processId, Long versionId) {
        ProcessVersion version = getVersion(versionId);
        ProcessDefinition process = getProcess(processId);
        process.setVersion(process.getVersion() + 1);
        ProcessDefinition saved = processRepository.save(process);
        createVersionSnapshot(saved, "SYSTEM", "v" + version.getVersionNumber() + " geri yüklendi");
        logActivity(saved, "SYSTEM", "VERSION_RESTORED", "v" + version.getVersionNumber() + " geri yüklendi");
        return saved;
    }

    private void createVersionSnapshot(ProcessDefinition process, String changedBy, String description) {
        ProcessVersion version = new ProcessVersion();
        version.setProcess(process);
        version.setVersionNumber(process.getVersion());
        version.setChangedBy(changedBy);
        version.setChangeDescription(description);
        version.setChangedAt(LocalDateTime.now());
        version.setSnapshotData("Süreç: " + process.getName() + ", Steps: " + process.getSteps().size());
        versionRepository.save(version);
    }

    public List<ActivityLog> getProcessLogs(Long processId) {
        return logRepository.findByProcessIdOrderByTimestampDesc(processId);
    }

    public List<ActivityLog> getAllLogs() {
        return logRepository.findAllByOrderByTimestampDesc();
    }

    public ActivityLog logActivity(ProcessDefinition process, String actor, String action, String details) {
        ActivityLog log = new ActivityLog();
        log.setProcess(process);
        log.setActor(actor);
        log.setAction(action);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        return logRepository.save(log);
    }
}
