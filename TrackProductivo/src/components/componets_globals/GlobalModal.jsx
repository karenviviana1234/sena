// GlobalModal.jsx
import React from 'react';
import { Modal, Button } from '@nextui-org/react';

const GlobalModal = ({ open, onClose, title, footer, children }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>
                <h4>{title}</h4>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                {footer(onClose)}
            </Modal.Footer>
        </Modal>
    );
};

export default GlobalModal;
