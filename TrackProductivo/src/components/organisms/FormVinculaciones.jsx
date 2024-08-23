import React from "react";

function FormVinculaciones({ formData, onChange }) {
  return (
    <form>
      <label>
        Instructor:
        <input
          type="text"
          name="instructor"
          value={formData.instructor}
          onChange={onChange}
        />
      </label>
      <label>
        Tipo:
        <input
          type="text"
          name="tipo"
          value={formData.tipo}
          onChange={onChange}
        />
      </label>
      <label>
        Sede:
        <input
          type="text"
          name="sede"
          value={formData.sede}
          onChange={onChange}
        />
      </label>
      <label>
        Área:
        <input
          type="text"
          name="area"
          value={formData.area}
          onChange={onChange}
        />
      </label>
    </form>
  );
}

export default FormVinculaciones;
