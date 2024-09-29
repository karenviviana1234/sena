<<<<<<< HEAD
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

const GlobalModal = ({ isOpen, onOpenChange, title, children, footer }) => {
  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="max-h-[80vh] overflow-y-auto">{children}</ModalBody>
            {footer && <ModalFooter>{footer(onClose)}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </Modal>
  );
=======
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
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
};

export default GlobalModal;
