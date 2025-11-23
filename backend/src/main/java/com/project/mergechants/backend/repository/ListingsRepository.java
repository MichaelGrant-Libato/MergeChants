package com.project.mergechants.backend.repository;

import com.project.mergechants.backend.entity.ListingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListingsRepository extends JpaRepository<ListingsEntity, Long>{
  List<ListingsEntity> findBySeller(String seller);
  List<ListingsEntity> findByStatus(String status);
  List<ListingsEntity> findByCategory(String category);
}