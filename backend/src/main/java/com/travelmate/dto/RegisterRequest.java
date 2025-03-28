package com.travelmate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Il nome utente è obbligatorio")
    private String username;

    @Email(message = "Email non valida")
    @NotBlank(message = "L'email è obbligatoria")
    private String email;

    @NotBlank(message = "La password è obbligatoria")
    @Size(min = 8, message = "La password deve contenere almeno 8 caratteri")
    private String password;
}
