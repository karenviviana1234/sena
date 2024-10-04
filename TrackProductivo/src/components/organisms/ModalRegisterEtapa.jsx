import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter, Button } from '@nextui-org/react';
import FormProductiva from '../molecules/Productivas/FormEtapaPractica';

function ModalEtapaPractica({ isOpen, onClose, etapa, onSave }) {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    {etapa ? 'Editar Etapa Práctica' : 'Agregar Etapa Práctica'}
                </ModalHeader>
                <FormProductiva etapa={etapa} onSave={onSave} />
                <ModalFooter>
                    <div className="flex justify-between items-center">
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button onClick={onSave} color="primary">Guardar</Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ModalEtapaPractica;
