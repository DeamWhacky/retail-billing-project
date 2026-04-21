package com.retail.billing.service;

import com.retail.billing.dto.AuthDTOs.*;
import com.retail.billing.entity.Role;
import com.retail.billing.entity.Role.ERole;
import com.retail.billing.entity.User;
import com.retail.billing.repository.RoleRepository;
import com.retail.billing.repository.UserRepository;
import com.retail.billing.security.JwtUtils;
import com.retail.billing.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired AuthenticationManager authManager;
    @Autowired UserRepository userRepo;
    @Autowired RoleRepository roleRepo;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    public JwtResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = jwtUtils.generateJwtToken(auth);
        UserDetailsImpl ud = (UserDetailsImpl) auth.getPrincipal();
        List<String> roles = ud.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        return JwtResponse.builder()
                .token(jwt).id(ud.getId())
                .username(ud.getUsername()).email(ud.getEmail())
                .roles(roles).build();
    }

    public MessageResponse register(RegisterRequest req) {
        if (userRepo.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken!");
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already in use!");

        User user = User.builder()
                .name(req.getName())
                .username(req.getUsername())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .build();

        Set<String> strRoles = req.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            roles.add(getRoleOrThrow(ERole.ROLE_USER));
        } else {
            strRoles.forEach(role -> {
                if ("admin".equals(role)) roles.add(getRoleOrThrow(ERole.ROLE_ADMIN));
                else roles.add(getRoleOrThrow(ERole.ROLE_USER));
            });
        }
        user.setRoles(roles);
        userRepo.save(user);
        return new MessageResponse("User registered successfully!");
    }

    private Role getRoleOrThrow(ERole name) {
        return roleRepo.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role not found: " + name));
    }
}
