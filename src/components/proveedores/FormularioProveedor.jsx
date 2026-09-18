import { useState, useEffect } from 'react';

function FormularioProveedor({ proveedor, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    contacto: '',
    direccion: '',
    estado: 'true',
  });

  // Al abrir el modal, precargar los datos si estamos editando
  useEffect(() => {
    if (proveedor) {
      const esActivo = proveedor.estado === false || proveedor.estado === 0 || proveedor.estado === '0' ? 'false' : 'true';

      setFormData({
        nombre: proveedor.nombre || '',
        telefono: proveedor.telefono || '',
        contacto: proveedor.contacto || '',
        direccion: proveedor.direccion || '',
        estado: esActivo,
      });
    } else {
      setFormData({
        nombre: '',
        telefono: '',
        contacto: '',
        direccion: '',
        estado: 'true',
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
    onGuardar({
      ...formData,
      estado: formData.estado === 'true',
    });
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

      <div className="campo">
        <label htmlFor="estado">Estado</label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
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