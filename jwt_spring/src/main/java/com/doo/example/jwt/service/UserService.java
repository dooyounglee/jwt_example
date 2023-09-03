package com.doo.example.jwt.service;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.doo.example.jwt.config.jwt.TokenProvider;
import com.doo.example.jwt.entity.RefreshToken;
import com.doo.example.jwt.entity.User;
import com.doo.example.jwt.repository.RefreshTokenRepository;
import com.doo.example.jwt.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final TokenProvider tokenProvider;
	
	public void signup(User user) {
		log.debug("signup");
		
		userRepository.save(user);
	}
	
	public Map<String, Object> login(User user) {
		log.debug("login");
		
		String token = tokenProvider.generateToken(user, Duration.ofSeconds(5));
		String refreshToken = tokenProvider.generateToken(user, Duration.ofDays(1));
		log.debug("token: {}", token);
		log.debug("refreshToken: {}", refreshToken);
		
		refreshTokenRepository.save(RefreshToken.builder()
				.userId(user.getId())
				.refreshToken(refreshToken)
				.build());
		
		Map<String, Object> map = new HashMap<>();
		map.put("token", token);
		map.put("refreshToken", refreshToken);
		
		return map;
	}
	
	public List<User> list() {
		return userRepository.findAll();
	}
	
	public Map<String, Object> refreshToken(RefreshToken refreshToken) throws Exception {
		RefreshToken refreshToken1 = refreshTokenRepository.findByRefreshToken(refreshToken.getRefreshToken())
				.orElseThrow(() -> new Exception());
		log.debug("refreshToken1: {}", refreshToken1);
		
		User user = userRepository.findById(refreshToken1.getUserId())
				.orElseThrow(() -> new Exception());
		log.debug("user: {}", user);
		
		String token = tokenProvider.generateToken(user, Duration.ofSeconds(5));
		log.debug("token: {}", token);
		
		return Map.of("token", token);
	}
}
