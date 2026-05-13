package com.mutuelle.services;

import com.mutuelle.models.Member;
import com.mutuelle.models.UbudeheCategory;
import com.mutuelle.models.CoverageStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MemberService {
    private Map<String, Member> members = new HashMap<>();
    private Map<String, Member> nationalIdIndex = new HashMap<>();

    public Member registerMember(String nationalId, String firstName, 
                                 String lastName, LocalDate dateOfBirth, 
                                 String phoneNumber, UbudeheCategory category) {
        
        if (nationalIdIndex.containsKey(nationalId)) {
            throw new IllegalArgumentException("Member with this National ID already exists");
        }

        Member member = new Member(nationalId, firstName, lastName, 
                                   dateOfBirth, phoneNumber, category);
        members.put(member.getMemberId(), member);
        nationalIdIndex.put(nationalId, member);
        
        return member;
    }

    public Member findById(String memberId) {
        return members.get(memberId);
    }

    public List<Member> getAllMembers() {
        return new ArrayList<>(members.values());
    }

    public List<Member> searchByName(String searchTerm) {
        String lowerSearch = searchTerm.toLowerCase();
        return members.values().stream()
            .filter(m -> m.getFullName().toLowerCase().contains(lowerSearch))
            .collect(Collectors.toList());
    }

    public void updateCategory(String memberId, UbudeheCategory newCategory) {
        Member member = findById(memberId);
        if (member == null) {
            throw new IllegalArgumentException("Member not found");
        }
        member.setCategory(newCategory);
    }

    public List<Member> getMembersByStatus(CoverageStatus status) {
        return members.values().stream()
            .filter(m -> m.getCoverageStatus() == status)
            .collect(Collectors.toList());
    }

    public List<Member> getMembersByCategory(UbudeheCategory category) {
        return members.values().stream()
            .filter(m -> m.getCategory() == category)
            .collect(Collectors.toList());
    }

    public int getTotalMembers() {
        return members.size();
    }

    public Map<String, Integer> getStatistics() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("total", members.size());
        stats.put("active", (int) members.values().stream()
            .filter(m -> m.getCoverageStatus() == CoverageStatus.ACTIVE).count());
        stats.put("pending", (int) members.values().stream()
            .filter(m -> m.getCoverageStatus() == CoverageStatus.PENDING).count());
        return stats;
    }
}