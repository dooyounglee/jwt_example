package com.doo.example.jwt.controller;

import java.util.List;
import java.util.Map;

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
	public Map<String, Object> login(@RequestBody User user) {
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
		
		if (refreshToken.getToken() == null) {
			throw new Exception();
		}
		return userService.refreshToken(refreshToken);
	}
}
