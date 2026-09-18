package com.inventario.sistema;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarHash {
    public static void main(String[] args) {
        System.out.println(new BCryptPasswordEncoder().encode("3104008272/js"));
    }
}