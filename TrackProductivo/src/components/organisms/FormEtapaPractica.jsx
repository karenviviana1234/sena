import React, { useState } from 'react';
import { Modal, Input, Select, Button } from '@nextui-org/react';
import axiosClient from '../../configs/axiosClient';
import PropTypes from 'prop-types';

function FormEtapaPractica({ isOpen, onClose, onRefresh }) {
  const [selectedFicha, setSelectedFicha] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');

  const handleRegisterProductiva = async () => {
    try {
      const response = await axiosClient.post('/productiva/registrar', {
        matricula: selectedFicha,
        empresa: selectedEmpresa,
        alternativa: 'Contrato de Aprendizaje',
        estado: selectedEstado,
      });

      if (response.data.message === 'Etapa productiva, seguimientos y bitácoras registrados correctamente') {
        alert('Etapa productiva registrada con éxito');
        onClose();
        onRefresh();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error registering productiva:', error.message);
      alert('Error al registrar la etapa productiva');
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2>Registrar Etapa Práctica</h2>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Ficha"
            value={selectedFicha}
            onChange={(e) => setSelectedFicha(e.target.value)}
          />
          <Select
            label="Empresa"
            placeholder="Seleccione una empresa"
            onChange={(value) => setSelectedEmpresa(value)}
          >
            {/* Opciones de empresas */}
          </Select>
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            onChange={(value) => setSelectedEstado(value)}
          >
            <option value="Inicio">Inicio</option>
            <option value="Renuncia">Renuncia</option>
            <option value="Terminado">Terminado</option>
          </Select>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button auto onClick={handleRegisterProductiva}>
          Registrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

FormEtapaPractica.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default FormEtapaPractica;
