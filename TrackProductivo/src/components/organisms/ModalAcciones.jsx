import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

// Componente GlobalModal
const ModalAcciones = ({ isOpen, onClose, title, bodyContent, footerActions }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{bodyContent}</ModalBody>
            <ModalFooter>
              {footerActions.map((action, index) => (
                <Button
                  key={index}
                  color={action.color || "primary"}
                  variant={action.variant || "solid"}
                  onPress={action.onPress || onClose}
                >
                  {action.label}
                </Button>
              ))}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAcciones;
