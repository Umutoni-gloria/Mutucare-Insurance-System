package com.mutuelle.controllers;

import com.mutuelle.models.Member;
import com.mutuelle.models.Payment;
import com.mutuelle.services.MemberService;
import com.mutuelle.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private MemberService memberService;

    @PostMapping
    public ResponseEntity<?> recordPayment(@RequestBody Map<String, Object> request) {
        try {
            String memberId = (String) request.get("memberId");
            double amount = Double.parseDouble(request.get("amount").toString());
            String paymentMethod = (String) request.get("paymentMethod");

            Member member = memberService.findById(memberId);
            if (member == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Member not found"));
            }

            Payment payment = paymentService.recordPayment(member, amount, paymentMethod);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Payment>> getPaymentHistory(@PathVariable String memberId) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(memberId));
    }

    @GetMapping("/member/{memberId}/total")
    public ResponseEntity<?> getTotalPaid(@PathVariable String memberId) {
        double total = paymentService.getTotalPaid(memberId);
        return ResponseEntity.ok(Map.of("totalPaid", total));
    }
}