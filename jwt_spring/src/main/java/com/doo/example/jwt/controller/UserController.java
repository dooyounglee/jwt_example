package com.doo.example.jwt.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.doo.example.jwt.entity.RefreshToken;
import com.doo.example.jwt.entity.User;
import com.doo.example.jwt.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

	private final UserService userService;
	
	@PostMapping("/signup")
	public Map<String, Object> signup(@RequestBody User user) {
		log.debug("user: {}", user);
		
		userService.signup(user);
		return Map.of();
	}
	
	@PostMapping("/login")
	public Map<String, Object> login(@RequestBody User user) throws Exception {
		log.debug("user: {}", user);
		
		return userService.login(user);
	}
	
	@GetMapping("/list")
	public List<User> list() {
		log.debug("list");
		return userService.list();
	}
	
	@PostMapping("/refreshToken")
	public Map<String, Object> refreshToken(@RequestBody RefreshToken refreshToken) throws Exception {
		log.debug("refreshToken");
		
		// token없이 달랑 refreshToken만 가지고 왔으면
		// 만료인지 모르기 때문에 더 진행 안함. 바로 exception 때림
		if (refreshToken.getToken() == null) {
			throw new Exception();
		}
		return userService.refreshToken(refreshToken);
	}
	
	@GetMapping("/get")
	public User get(@AuthenticationPrincipal User user) {
		log.debug("user1: {}", user);
		log.debug("user2: {}", SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		log.debug("user3: {}", SecurityContextHolder.getContext().getAuthentication().getDetails());
		log.debug("user4: {}", SecurityContextHolder.getContext().getAuthentication().getName());
		return user;
	}
}
