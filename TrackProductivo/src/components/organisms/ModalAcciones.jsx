import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

// Componente GlobalModal
const ModalAcciones = ({ isOpen, onClose, title, bodyContent, footerActions }) => {
  return (
<<<<<<< HEAD
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{bodyContent}</ModalBody>
            <ModalFooter>
=======
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="w-auto max-w-fit"  // Ajusta el ancho del modal
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title}
            </ModalHeader>
            <ModalBody className="w-auto">
              {bodyContent}
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
>>>>>>> 28fc74a883fc62fcfeaeb5bfc30c3690acb9ac7d
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAcciones;
