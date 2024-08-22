// SeguimientoModal.jsx
import React from 'react';
import { Modal, Button, Input } from '@nextui-org/react';

const SeguimientoModal = ({ open, onClose, mode, initialData, setMensaje, mensaje }) => {
    const handleSubmit = () => {
        // Lógica para manejar el envío del formulario o acción
        setMensaje('¡Acción realizada con éxito!');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>
                <h4>{mode === 'create' ? 'Crear Seguimiento' : 'Editar Seguimiento'}</h4>
            </Modal.Header>
            <Modal.Body>
                <Input label="Nombre" defaultValue={initialData?.nombres || ''} fullWidth />
                <Input label="Detalles" defaultValue={initialData?.detalles || ''} fullWidth />
                {/* Agrega más campos según sea necesario */}
                {mensaje && <div className="text-green-600">{mensaje}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onClick={onClose}>
                    Cancelar
                </Button>
                <Button auto onClick={handleSubmit}>
                    {mode === 'create' ? 'Crear' : 'Actualizar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SeguimientoModal;
