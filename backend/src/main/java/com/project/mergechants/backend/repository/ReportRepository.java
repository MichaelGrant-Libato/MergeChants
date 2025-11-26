package com.project.mergechants.backend.repository;

import com.project.mergechants.backend.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<ReportEntity, Long> {
    List<ReportEntity> findByReportedId(String reportedId);
}