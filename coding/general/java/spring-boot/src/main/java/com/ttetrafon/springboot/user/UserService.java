package com.ttetrafon.springboot.user;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final List<User> users = List.of(
            new User(UUID.randomUUID(), "Nakis", "nakis@ttetrafon.com"),
            new User(UUID.randomUUID(), "Vi", "vi@ttetrafon.com"),
            new User(UUID.randomUUID(), "Eir", "eir@ttetrafon.com")
    );

    public List<User> findAll() {
        return users;
    }

    public User findById(UUID id) {
        Optional<User> user = users
                .stream()
                .filter(u -> u.id().equals(id))
                .findFirst();
        return user.orElse(null);
    }
}
