package com.retail.billing.config;

import com.retail.billing.entity.Role;
import com.retail.billing.entity.Role.ERole;
import com.retail.billing.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepo;

    @Override
    public void run(String... args) {
        if (roleRepo.findByName(ERole.ROLE_USER).isEmpty()) {
            roleRepo.save(new Role(null, ERole.ROLE_USER));
        }
        if (roleRepo.findByName(ERole.ROLE_ADMIN).isEmpty()) {
            roleRepo.save(new Role(null, ERole.ROLE_ADMIN));
        }
    }
}
