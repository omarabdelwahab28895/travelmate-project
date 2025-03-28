package com.travelmate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Email(message = "Email non valida")
    private String email;

    @Size(min = 8, message = "La password deve contenere almeno 8 caratteri")
    private String password;
}
