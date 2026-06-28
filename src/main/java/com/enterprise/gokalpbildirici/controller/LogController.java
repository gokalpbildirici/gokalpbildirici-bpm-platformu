package com.enterprise.gokalpbildirici.controller;

import com.enterprise.gokalpbildirici.model.ActivityLog;
import com.enterprise.gokalpbildirici.service.ProcessService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogController {

    private final ProcessService processService;

    public LogController(ProcessService processService) {
        this.processService = processService;
    }

    @GetMapping
    public List<ActivityLog> getAllLogs() {
        return processService.getAllLogs();
    }
}
