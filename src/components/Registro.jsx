import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registro.css';

export default function Registro() {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        if (!formData.nombre || !formData.correo || !formData.contrasena) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const mensajeError = await response.text();
                throw new Error(mensajeError || 'Error al registrar el usuario.');
            }

            setExito('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-container">
            <div className="registro-card">
                <h2 className="registro-title">Crear Cuenta</h2>
                <p className="registro-subtitle">Ingresa tus datos para registrarte en el sistema</p>

                {error && <div className="msg-error">{error}</div>}
                {exito && <div className="msg-exito">{exito}</div>}

                <form onSubmit={handleSubmit} className="registro-form">
                    <div className="input-group">
                        <label htmlFor="nombre">Nombre Completo</label>
                        <input
                            id="nombre"
                            type="text"
                            name="nombre"
                            placeholder="Ej. Juan Pérez"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input
                            id="correo"
                            type="email"
                            name="correo"
                            placeholder="usuario@dominio.com"
                            value={formData.correo}
                            onChange={handleChange}
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            id="contrasena"
                            type="password"
                            name="contrasena"
                            placeholder="••••••••"
                            value={formData.contrasena}
                            onChange={handleChange}
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarme'}
                    </button>
                </form>

                <p className="registro-footer">
                    ¿Ya tienes cuenta? <Link to="/login" className="registro-link">Inicia Sesión aquí</Link>
                </p>
            </div>
        </div>
    );
}