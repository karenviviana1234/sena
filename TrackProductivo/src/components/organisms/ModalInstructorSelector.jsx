import React from 'react';
import { Modal, Button, Select } from '@nextui-org/react';

function ModalInstructorSelector({ isOpen, onClose, onInstructorChange }) {
    const [selectedInstructor, setSelectedInstructor] = React.useState('');

    const handleInstructorChange = (value) => {
        setSelectedInstructor(value);
        onInstructorChange(value);
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>
                <h3>Seleccionar Instructor</h3>
            </Modal.Header>
            <Modal.Body>
                <Select
                    value={selectedInstructor}
                    onChange={handleInstructorChange}
                    options={[
                        { value: '', label: 'Seleccione un instructor' },
                        ...instructores.map(i => ({ value: i.id, label: `${i.nombres} ${i.apellidos}` }))
                    ]}
                >
                    <Select.Button>Seleccionar Instructor</Select.Button>
                    <Select.Content>
                        <Select.Item value="">Eliminar Instructor</Select.Item>
                        {instructores.map(i => (
                            <Select.Item key={i.id} value={i.id}>{`${i.nombres} ${i.apellidos}`}</Select.Item>
                        ))}
                    </Select.Content>
                </Select>
            </Modal.Body>
            <Modal.Footer>
                <Button color="secondary" onClick={onClose}>Cancelar</Button>
                <Button color="primary" onClick={() => handleInstructorChange(selectedInstructor)} disabled={!selectedInstructor}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalInstructorSelector;
