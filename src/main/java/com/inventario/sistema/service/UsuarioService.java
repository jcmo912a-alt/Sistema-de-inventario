package com.inventario.sistema.service;

import com.inventario.sistema.entity.Usuario;
import com.inventario.sistema.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("El correo ya se encuentra registrado.");
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario autenticarUsuario(String correo, String contraseña) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent() && usuarioOpt.get().getContraseña().equals(contraseña)) {
            return usuarioOpt.get();
        }

        throw new RuntimeException("Credenciales inválidas.");
    }
}