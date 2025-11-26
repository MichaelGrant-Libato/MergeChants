package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.entity.EscrowEntity;
import com.appdevg4.mergemasters.mergechants.repository.EscrowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EscrowService {

    @Autowired
    private EscrowRepository escrowRepository;

    public EscrowEntity bindAgreement(EscrowEntity escrow) {
        escrow.setStatus("BINDING_INITIATED");
        if (escrow.getAgreementTerms() == null) {
            escrow.setAgreementTerms("Standard CIT-U Campus Safety Agreement v1.0");
        }
        return escrowRepository.save(escrow);
    }
    
    public EscrowEntity resolveAgreement(Long id) {
        EscrowEntity escrow = escrowRepository.findById(id).orElseThrow();
        escrow.setStatus("COMPLETED");
        return escrowRepository.save(escrow);
    }
}