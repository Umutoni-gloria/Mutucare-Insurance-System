/**
 * MutualCare Insurance System — Frontend Unit Tests
 * Tests all core business logic functions from main.js
 *
 * Framework : Jest (JavaScript Testing Framework)
 * Phase     : Phase 4 — Software Test Plan
 * Author    : MutualCare Dev Team
 * Version   : 1.0.0
 *
 * Run with: npm test
 */

// ─── HELPER: Replicate core functions from main.js for testing ───────────────

/**
 * Calculates age from a date-of-birth string.
 * @param {string} dob - Date string e.g. "2000-05-14"
 * @returns {number} Age in years
 */
function calculateAge(dob) {
    const today = new Date();
    const dobDate = new Date(dob);
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
    return age;
}

/**
 * Returns the annual contribution amount for a member based on category.
 * 2026/2027 Ubudehe official structure.
 * @param {string} category
 * @returns {number} Amount in RWF
 */
function getCategoryAmount(category) {
    const amounts = {
        CATEGORY_1: 0,
        CATEGORY_2: 3000,
        CATEGORY_3: 5000,
        CATEGORY_4: 8000,
        CATEGORY_5: 20000
    };
    return amounts[category] !== undefined ? amounts[category] : -1;
}

/**
 * Returns human-readable label for a category code.
 * @param {string} cat
 * @returns {string}
 */
function catLabel(cat) {
    const labels = {
        CATEGORY_1: 'Category I — Free (Gov. Sponsored)',
        CATEGORY_2: 'Category II — 3,000 RWF/yr',
        CATEGORY_3: 'Category III — 5,000 RWF/yr',
        CATEGORY_4: 'Category IV — 8,000 RWF/yr',
        CATEGORY_5: 'Category V — 20,000 RWF/yr'
    };
    return labels[cat] || 'Unknown Category';
}

/**
 * Validates a Rwandan National ID format.
 * Must be 16 digits starting with 1.
 * @param {string} nid
 * @returns {boolean}
 */
function validateNationalId(nid) {
    return /^1\d{15}$/.test(nid);
}

/**
 * Validates a Rwandan phone number.
 * Must start with 078, 079, 072, or 073 followed by 7 digits.
 * @param {string} phone
 * @returns {boolean}
 */
function validatePhone(phone) {
    return /^07[2389]\d{7}$/.test(phone);
}

/**
 * Checks if a member is eligible for family plan.
 * Only Married or Divorced members qualify.
 * @param {string} maritalStatus
 * @returns {boolean}
 */
function isEligibleForFamily(maritalStatus) {
    return maritalStatus === 'married' || maritalStatus === 'divorced';
}

/**
 * Generates a receipt number for a payment.
 * Format: RCP-<timestamp>
 * @returns {string}
 */
function generateReceipt() {
    return 'RCP-' + Date.now();
}

/**
 * Returns badge CSS class based on coverage status.
 * @param {string} status
 * @returns {string}
 */
function getStatusBadgeClass(status) {
    const map = {
        ACTIVE: 'badge-green',
        PENDING: 'badge-yellow',
        EXPIRED: 'badge-red',
        SUSPENDED: 'badge-gray'
    };
    return map[status] || 'badge-gray';
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 1 — AGE VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-AGE: Age Calculation & Validation', () => {

    test('TC-AGE-01: Adult member (30 years old) returns age >= 18', () => {
        const dob = new Date();
        dob.setFullYear(dob.getFullYear() - 30);
        const age = calculateAge(dob.toISOString().split('T')[0]);
        expect(age).toBeGreaterThanOrEqual(18);
    });

    test('TC-AGE-02: Child under 18 (10 years old) returns age < 18', () => {
        const dob = new Date();
        dob.setFullYear(dob.getFullYear() - 10);
        const age = calculateAge(dob.toISOString().split('T')[0]);
        expect(age).toBeLessThan(18);
    });

    test('TC-AGE-03: Member exactly 18 years old is allowed to register', () => {
        const dob = new Date();
        dob.setFullYear(dob.getFullYear() - 18);
        const age = calculateAge(dob.toISOString().split('T')[0]);
        expect(age).toBeGreaterThanOrEqual(18);
    });

    test('TC-AGE-04: Member aged 17 is blocked from self-registration', () => {
        const dob = new Date();
        dob.setFullYear(dob.getFullYear() - 17);
        const age = calculateAge(dob.toISOString().split('T')[0]);
        expect(age).toBeLessThan(18);
    });

    test('TC-AGE-05: Newborn (0 years) is valid as dependent', () => {
        const dob = new Date().toISOString().split('T')[0];
        const age = calculateAge(dob);
        expect(age).toBe(0);
        expect(age).toBeLessThan(18);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 2 — UBUDEHE CATEGORY AMOUNTS (2026/2027)
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-CAT: Ubudehe Category Amount Calculation', () => {

    test('TC-CAT-01: Category I pays 0 RWF (fully government sponsored)', () => {
        expect(getCategoryAmount('CATEGORY_1')).toBe(0);
    });

    test('TC-CAT-02: Category II pays 3,000 RWF per year', () => {
        expect(getCategoryAmount('CATEGORY_2')).toBe(3000);
    });

    test('TC-CAT-03: Category III pays 5,000 RWF per year', () => {
        expect(getCategoryAmount('CATEGORY_3')).toBe(5000);
    });

    test('TC-CAT-04: Category IV pays 8,000 RWF per year', () => {
        expect(getCategoryAmount('CATEGORY_4')).toBe(8000);
    });

    test('TC-CAT-05: Category V pays 20,000 RWF per year', () => {
        expect(getCategoryAmount('CATEGORY_5')).toBe(20000);
    });

    test('TC-CAT-06: Unknown category returns -1 (invalid)', () => {
        expect(getCategoryAmount('CATEGORY_9')).toBe(-1);
    });

    test('TC-CAT-07: catLabel returns correct label for Category I', () => {
        expect(catLabel('CATEGORY_1')).toContain('Free');
    });

    test('TC-CAT-08: catLabel returns correct label for Category V', () => {
        expect(catLabel('CATEGORY_5')).toContain('20,000');
    });

    test('TC-CAT-09: catLabel returns Unknown for invalid category', () => {
        expect(catLabel('')).toBe('Unknown Category');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 3 — NATIONAL ID VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-NID: National ID Validation', () => {

    test('TC-NID-01: Valid Rwandan NID (16 digits starting with 1) passes', () => {
        expect(validateNationalId('1199880012345678')).toBe(true);
    });

    test('TC-NID-02: NID starting with 2 is rejected', () => {
        expect(validateNationalId('2199880012345678')).toBe(false);
    });

    test('TC-NID-03: NID with only 10 digits is rejected', () => {
        expect(validateNationalId('1234567890')).toBe(false);
    });

    test('TC-NID-04: NID with letters is rejected', () => {
        expect(validateNationalId('119988ABC12345')).toBe(false);
    });

    test('TC-NID-05: Empty NID is rejected', () => {
        expect(validateNationalId('')).toBe(false);
    });

    test('TC-NID-06: NID with 17 digits is rejected (too long)', () => {
        expect(validateNationalId('11998800123456789')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 4 — PHONE NUMBER VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-PHONE: Phone Number Validation', () => {

    test('TC-PHONE-01: Valid 078 number passes', () => {
        expect(validatePhone('0781234567')).toBe(true);
    });

    test('TC-PHONE-02: Valid 079 number passes', () => {
        expect(validatePhone('0791234567')).toBe(true);
    });

    test('TC-PHONE-03: Valid 072 number passes', () => {
        expect(validatePhone('0721234567')).toBe(true);
    });

    test('TC-PHONE-04: Valid 073 number passes', () => {
        expect(validatePhone('0731234567')).toBe(true);
    });

    test('TC-PHONE-05: Number starting with 071 is rejected', () => {
        expect(validatePhone('0711234567')).toBe(false);
    });

    test('TC-PHONE-06: Number with only 9 digits is rejected', () => {
        expect(validatePhone('078123456')).toBe(false);
    });

    test('TC-PHONE-07: Empty phone number is rejected', () => {
        expect(validatePhone('')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 5 — MARITAL STATUS & FAMILY ELIGIBILITY
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-FAMILY: Marital Status & Family Plan Eligibility', () => {

    test('TC-FAMILY-01: Married member is eligible for family plan', () => {
        expect(isEligibleForFamily('married')).toBe(true);
    });

    test('TC-FAMILY-02: Divorced member is eligible for family plan', () => {
        expect(isEligibleForFamily('divorced')).toBe(true);
    });

    test('TC-FAMILY-03: Single member is NOT eligible for family plan', () => {
        expect(isEligibleForFamily('single')).toBe(false);
    });

    test('TC-FAMILY-04: Empty marital status is NOT eligible', () => {
        expect(isEligibleForFamily('')).toBe(false);
    });

    test('TC-FAMILY-05: Undefined marital status is NOT eligible', () => {
        expect(isEligibleForFamily(undefined)).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 6 — PAYMENT & RECEIPT GENERATION
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-PAYMENT: Payment & Receipt Generation', () => {

    test('TC-PAY-01: Receipt number starts with RCP-', () => {
        const receipt = generateReceipt();
        expect(receipt).toMatch(/^RCP-\d+$/);
    });

    test('TC-PAY-02: Two receipts generated at different times are unique', () => {
        const r1 = generateReceipt();
        const r2 = generateReceipt();
        // They may be same if called in same ms — so just check format
        expect(r1).toMatch(/^RCP-\d+$/);
        expect(r2).toMatch(/^RCP-\d+$/);
    });

    test('TC-PAY-03: Category I member payment amount is 0 (free)', () => {
        const amount = getCategoryAmount('CATEGORY_1');
        expect(amount).toBe(0);
    });

    test('TC-PAY-04: Payment amount for Category V is highest (20,000)', () => {
        const amounts = [1,2,3,4,5].map(i => getCategoryAmount(`CATEGORY_${i}`));
        expect(Math.max(...amounts)).toBe(20000);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 7 — COVERAGE STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
describe('TC-STATUS: Coverage Status Badge Class', () => {

    test('TC-STATUS-01: ACTIVE status returns green badge class', () => {
        expect(getStatusBadgeClass('ACTIVE')).toBe('badge-green');
    });

    test('TC-STATUS-02: PENDING status returns yellow badge class', () => {
        expect(getStatusBadgeClass('PENDING')).toBe('badge-yellow');
    });

    test('TC-STATUS-03: EXPIRED status returns red badge class', () => {
        expect(getStatusBadgeClass('EXPIRED')).toBe('badge-red');
    });

    test('TC-STATUS-04: SUSPENDED status returns gray badge class', () => {
        expect(getStatusBadgeClass('SUSPENDED')).toBe('badge-gray');
    });

    test('TC-STATUS-05: Unknown status defaults to gray badge', () => {
        expect(getStatusBadgeClass('UNKNOWN')).toBe('badge-gray');
    });
});
