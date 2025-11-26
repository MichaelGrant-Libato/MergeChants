package com.project.mergechants.backend.service;

import com.project.mergechants.backend.entity.EscrowEntity;
import com.project.mergechants.backend.repository.EscrowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EscrowService {

    @Autowired
    private EscrowRepository escrowRepository;

    // Matches "bindAgreement()" from your Diagram
    public EscrowEntity bindAgreement(EscrowEntity escrow) {
        escrow.setStatus("BINDING_INITIATED");
        if (escrow.getAgreementTerms() == null) {
            escrow.setAgreementTerms("Standard CIT-U Campus Safety Agreement v1.0");
        }
        return escrowRepository.save(escrow);
    }
    
    // Matches "resolveAgreement()" from your Diagram
    public EscrowEntity resolveAgreement(Long id) {
        EscrowEntity escrow = escrowRepository.findById(id).orElseThrow();
        escrow.setStatus("COMPLETED");
        return escrowRepository.save(escrow);
    }
}