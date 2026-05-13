package com.mutuelle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MutuelleApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(MutuelleApplication.class, args);
        System.out.println("\n╔══════════════════════════════════════════╗");
        System.out.println("║   Mutuelle System Started Successfully!  ║");
        System.out.println("║   Open: http://localhost:8080            ║");
        System.out.println("╚══════════════════════════════════════════╝\n");
    }
}