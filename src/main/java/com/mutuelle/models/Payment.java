package com.mutuelle.models;

import java.time.LocalDate;

public class Payment {
    private String paymentId;
    private String memberId;
    private double amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String receiptNumber;

    public Payment() {
    }

    public Payment(String memberId, double amount, String paymentMethod) {
        this.paymentId = "PAY" + System.currentTimeMillis();
        this.memberId = memberId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentDate = LocalDate.now();
        this.receiptNumber = "RCP" + System.currentTimeMillis();
    }

    // Getters and Setters
    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }
}