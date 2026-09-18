import { useState, useEffect } from 'react';

function FormularioProveedor({ proveedor, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    contacto: '',
    direccion: '',
  });

  // Al abrir el modal, precargar los datos si estamos editando
  useEffect(() => {
    if (proveedor) {
      setFormData({
        nombre: proveedor.nombre || '',
        telefono: proveedor.telefono || '',
        contacto: proveedor.contacto || '',
        direccion: proveedor.direccion || '',
      });
    } else {
      setFormData({
        nombre: '',
        telefono: '',
        contacto: '',
        direccion: '',
      });
    }
  }, [proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="campo">
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="contacto">Contacto (Email)</label>
        <input
          type="email"
          id="contacto"
          name="contacto"
          value={formData.contacto}
          onChange={handleChange}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="direccion">Dirección</label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          placeholder="Ej. Calle 10 # 4-20"
          value={formData.direccion}
          onChange={handleChange}
        />
      </div>

      <div className="formulario__acciones">
        <button type="button" onClick={onCancelar} className="boton boton--secundario">
          Cancelar
        </button>
        <button type="submit" className="boton boton--primario">
          Guardar
        </button>
      </div>
    </form>
  );
}

export default FormularioProveedor;