import React, { useState } from 'react';
import { Input, Button, Grid, Spacer } from '@nextui-org/react';

const FormAprendices = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombres: initialData?.nombres || '',
    correo: initialData?.correo || '',
    telefono: initialData?.telefono || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid.Container gap={2}>
        <Grid xs={12} sm={6}>
          <Input
            label="Nombre"
            placeholder="Ingresa tu nombre"
            fullWidth
            name="nombre"
            value={formData.nombres}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid xs={12}>
          <Input
            label="Correo"
            placeholder="Ingresa tu correo"
            type="email"
            fullWidth
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid xs={12}>
          <Input
            label="Teléfono"
            placeholder="Ingresa tu teléfono"
            fullWidth
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </Grid>
      </Grid.Container>
      <Spacer y={1.5} />
      <Grid.Container justify="flex-end" gap={2}>
        <Grid>
          <Button auto onClick={onCancel} color="error">
            Cancelar
          </Button>
        </Grid>
        <Grid>
          <Button auto type="submit" color="primary">
            Registrar
          </Button>
        </Grid>
      </Grid.Container>
    </form>
  );
};

export default FormAprendices;
