import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.correo || !formData.contrasena) {
            setError('Por favor ingresa correo y contraseña.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || 'Credenciales inválidas.');
            }

            const data = await response.json();
            const token = data?.token;

            if (!token) {
                throw new Error('No se recibió un token válido del servidor.');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify({ correo: formData.correo }));
            navigate('/dashboard');

        } catch (err) {
            setError(err.message);
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="login-subtitle">Accede al Sistema de Inventario</p>

                {error && <div className="msg-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
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

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes una cuenta?</p>
                    <Link to="/registro" className="btn-registro-link">
                        Crear cuenta nueva
                    </Link>
                </div>
            </div>
        </div>
    );


}