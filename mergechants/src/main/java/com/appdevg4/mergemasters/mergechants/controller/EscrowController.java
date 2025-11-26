package com.appdevg4.mergemasters.mergechants.controller;
import com.appdevg4.mergemasters.mergechants.entity.EscrowEntity;
import com.appdevg4.mergemasters.mergechants.service.EscrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/escrow")
@CrossOrigin(origins = "http://localhost:3000")
public class EscrowController {

    @Autowired
    private EscrowService escrowService;

    @PostMapping("/bind")
    public EscrowEntity createAgreement(@RequestBody EscrowEntity escrow) {
        return escrowService.bindAgreement(escrow);
    }

    @PutMapping("/{id}/resolve")
    public EscrowEntity resolveAgreement(@PathVariable Long id) {
        return escrowService.resolveAgreement(id);
    }
}