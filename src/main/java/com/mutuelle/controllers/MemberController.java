package com.mutuelle.controllers;

import com.mutuelle.models.Member;
import com.mutuelle.models.UbudeheCategory;
import com.mutuelle.services.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody Map<String, String> request) {
        try {
            String nationalId = request.get("nationalId");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            LocalDate dateOfBirth = LocalDate.parse(request.get("dateOfBirth"));
            String phoneNumber = request.get("phoneNumber");
            UbudeheCategory category = UbudeheCategory.valueOf(request.get("category"));

            Member member = memberService.registerMember(
                nationalId, firstName, lastName, dateOfBirth, phoneNumber, category);

            return ResponseEntity.ok(member);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<?> getMemberById(@PathVariable String memberId) {
        Member member = memberService.findById(memberId);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Member not found"));
        }
        return ResponseEntity.ok(member);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Member>> searchMembers(@RequestParam String query) {
        return ResponseEntity.ok(memberService.searchByName(query));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStatistics() {
        return ResponseEntity.ok(memberService.getStatistics());
    }

    @PutMapping("/{memberId}/category")
    public ResponseEntity<?> updateCategory(
        @PathVariable String memberId,
        @RequestBody Map<String, String> request) {
        try {
            UbudeheCategory newCategory = UbudeheCategory.valueOf(request.get("category"));
            memberService.updateCategory(memberId, newCategory);
            return ResponseEntity.ok(Map.of("message", "Category updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
}