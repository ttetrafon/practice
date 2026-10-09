package com.ttetrafon.springboot.user;

import com.ttetrafon.springboot.framework.annotations.Get;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Get
    public List<User> getAllUsers() {
        return userService.findAll();
    }
}
