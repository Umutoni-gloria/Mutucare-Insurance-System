package com.mutuelle;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * MutualCare Insurance System — Integration Tests
 * Tests the Spring Boot server endpoints and static file serving.
 *
 * Phase 4: Software Test Plan — Integration Test Suite
 * Author : MutualCare Dev Team
 * Version: 1.0.0
 */
@SpringBootTest
@AutoConfigureMockMvc
class MutuelleApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    // ─────────────────────────────────────────────────────────────────────────
    // TC-SERVER-01: Application Context Loads
    // ─────────────────────────────────────────────────────────────────────────
    @Test
    void contextLoads() {
        // Verifies Spring Boot application starts without errors
        // Expected: No exception thrown
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-SERVER-02: Home page is accessible at root URL
    // ─────────────────────────────────────────────────────────────────────────
    @Test
    void homePageLoads() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-SERVER-03: index.html is served correctly
    // ─────────────────────────────────────────────────────────────────────────
    @Test
    void indexHtmlIsServed() throws Exception {
        mockMvc.perform(get("/index.html"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("text/html"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-SERVER-04: CSS file is served correctly
    // ─────────────────────────────────────────────────────────────────────────
    @Test
    void cssFileIsServed() throws Exception {
        mockMvc.perform(get("/css/style.css"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("text/css"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-SERVER-05: JavaScript file is served correctly
    // ─────────────────────────────────────────────────────────────────────────
    @Test
    void jsFileIsServed() throws Exception {
        mockMvc.perform(get("/js/main.js"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/javascript"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-SERVER-06: RSSB Logo image is accessible
    // ─────────────────────────────────────────────────────────────────────────
    @Test
    void rssbLogoIsServed() throws Exception {
        mockMvc.perform(get("/images/rssb-logo.png"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("image/png"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-SERVER-07: RSSB Building background image is accessible
    // ─────────────────────────────────────────────────────────────────────────
    @Test
    void rssbBuildingImageIsServed() throws Exception {
        mockMvc.perform(get("/images/rssb-building.png"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("image/png"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TC-SERVER-08: Non-existent route returns 404
    // ─────────────────────────────────────────────────────────────────────────
    @Test
    void nonExistentPageReturns404() throws Exception {
        mockMvc.perform(get("/api/does-not-exist"))
                .andExpect(status().isNotFound());
    }
}
