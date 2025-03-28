package com.travelmate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Username obbligatorio")
    private String username;

    @NotBlank(message = "Password obbligatoria")
    private String password;
}
