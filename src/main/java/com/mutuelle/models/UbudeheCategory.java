package com.mutuelle.models;

public enum UbudeheCategory {
    CATEGORY_1(0, "Indigent - Free"),
    CATEGORY_2(3000, "Poor - 3,000 RWF"),
    CATEGORY_3(7000, "Medium - 7,000 RWF"),
    CATEGORY_4(30000, "Well-off - 30,000 RWF");

    private final int annualContribution;
    private final String description;

    UbudeheCategory(int annualContribution, String description) {
        this.annualContribution = annualContribution;
        this.description = description;
    }

    public int getAnnualContribution() {
        return annualContribution;
    }

    public String getDescription() {
        return description;
    }
}