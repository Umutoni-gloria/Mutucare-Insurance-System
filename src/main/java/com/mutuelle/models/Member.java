package com.mutuelle.models;

import java.time.LocalDate;

public class Member {
    private String memberId;
    private String nationalId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private UbudeheCategory category;
    private LocalDate registrationDate;
    private CoverageStatus coverageStatus;
    private LocalDate coverageExpiryDate;

    public Member() {
    }

    public Member(String nationalId, String firstName, String lastName,
                  LocalDate dateOfBirth, String phoneNumber, UbudeheCategory category) {
        this.memberId = "MUT" + System.currentTimeMillis();
        this.nationalId = nationalId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.phoneNumber = phoneNumber;
        this.category = category;
        this.registrationDate = LocalDate.now();
        this.coverageStatus = CoverageStatus.PENDING;
    }

    // Getters and Setters
    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public UbudeheCategory getCategory() {
        return category;
    }

    public void setCategory(UbudeheCategory category) {
        this.category = category;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public CoverageStatus getCoverageStatus() {
        return coverageStatus;
    }

    public void setCoverageStatus(CoverageStatus coverageStatus) {
        this.coverageStatus = coverageStatus;
    }

    public LocalDate getCoverageExpiryDate() {
        return coverageExpiryDate;
    }

    public void setCoverageExpiryDate(LocalDate coverageExpiryDate) {
        this.coverageExpiryDate = coverageExpiryDate;
    }

    public void updateCoverage(LocalDate expiryDate) {
        this.coverageExpiryDate = expiryDate;
        this.coverageStatus = CoverageStatus.ACTIVE;
    }
}