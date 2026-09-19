package com.inventario.sistema.service;

import com.inventario.sistema.entity.Usuario;
import com.inventario.sistema.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

/**
 * Lógica de negocio del módulo Usuario.
 * Las contraseñas se guardan siempre encriptadas con BCrypt.
 */
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /** Lista todos los usuarios. */
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    /** Busca un usuario por su ID. */
    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    /**
     * Registra un usuario: rechaza correos duplicados (409) y encripta la
     * contraseña.
     */
    public Usuario guardar(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        }
        usuario.setcontrasena(encoder.encode(usuario.getcontrasena()));
        return usuarioRepository.save(usuario);
    }

    /** Se mantiene por compatibilidad: delega en guardar. */
    public Usuario registrarUsuario(Usuario usuario) {
        return guardar(usuario);
    }

    /** Actualiza nombre y correo; la contraseña solo cambia si llega una nueva. */
    public Usuario actualizar(Integer id, Usuario datos) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // El correo nuevo no puede pertenecer a otro usuario
        if (!usuario.getCorreo().equals(datos.getCorreo())
                && usuarioRepository.existsByCorreo(datos.getCorreo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        }

        usuario.setNombre(datos.getNombre());
        usuario.setCorreo(datos.getCorreo());

        // Si no llega contraseña, se conserva el hash anterior
        if (datos.getcontrasena() != null && !datos.getcontrasena().isBlank()) {
            usuario.setcontrasena(encoder.encode(datos.getcontrasena()));
        }
        return usuarioRepository.save(usuario);
    }

    /**
     * Elimina un usuario; responde 409 si tiene movimientos asociados (llave
     * foránea).
     */
    public void eliminar(Integer id) {
        try {
            usuarioRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar: el usuario tiene registros asociados");
        }
    }

    /** Valida las credenciales comparando con el hash BCrypt. */
    public Usuario autenticarUsuario(String correo, String contrasena) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent()
                && encoder.matches(contrasena, usuarioOpt.get().getcontrasena())) {
            return usuarioOpt.get();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
    }
}