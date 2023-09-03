package com.doo.example.jwt.config;

import java.util.Optional;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.context.SecurityContextHolder;

import com.doo.example.jwt.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableJpaAuditing
@RequiredArgsConstructor
public class LoginUserAuditorAware implements AuditorAware<Long> {

	private final UserRepository userRepository;
	
	@Override
    public Optional<Long> getCurrentAuditor() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        long id = userRepository.findByEmail(email).get().getId();
        log.debug("id: {}", id);
        //if(user == null)
        //    return null;

        return Optional.ofNullable(id);
    }
}
