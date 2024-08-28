import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

const ModalAcciones = ({ isOpen, onClose, title, bodyContent, footerActions, onAction }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-auto max-w-fit">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="w-auto">
              {bodyContent}
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
              {footerActions.map((action, index) => (
                <Button
                  key={index}
                  color={action.color}
                  onPress={() => {
                    if (action.onPress) {
                      action.onPress(); // Ejecuta la acción definida
                    }
                    onClose(); // Cierra el modal al hacer clic en el botón
                  }}
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
