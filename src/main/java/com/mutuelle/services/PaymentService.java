package com.mutuelle.services;

import com.mutuelle.models.Member;
import com.mutuelle.models.Payment;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    private List<Payment> payments = new ArrayList<>();

    public Payment recordPayment(Member member, double amount, String paymentMethod) {
        Payment payment = new Payment(member.getMemberId(), amount, paymentMethod);
        payments.add(payment);
        
        // Update member coverage
        LocalDate expiryDate = LocalDate.now().plusYears(1);
        member.updateCoverage(expiryDate);
        
        return payment;
    }

    public List<Payment> getPaymentHistory(String memberId) {
        return payments.stream()
            .filter(p -> p.getMemberId().equals(memberId))
            .collect(Collectors.toList());
    }

    public double getTotalPaid(String memberId) {
        return payments.stream()
            .filter(p -> p.getMemberId().equals(memberId))
            .mapToDouble(Payment::getAmount)
            .sum();
    }

    public List<Payment> getAllPayments() {
        return new ArrayList<>(payments);
    }
}