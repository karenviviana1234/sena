import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import ModalNominas from "../templates/ModalNominas";

function AccionesModal({ label, isOpen, onClose, onAccept }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="top-center" width="90%">
      <ModalContent className="w-full max-w-screen-sm"> {/* Ajustar el tamaño del modal */}
        <ModalHeader></ModalHeader>
        <ModalBody>
          <label>{label}</label>
          <ModalNominas />
        </ModalBody>
        <ModalFooter>
          <Button className="bg-[#84CC16] text-white" onPress={onAccept}>
            Aceptar
          </Button>
          <Button color="danger" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AccionesModal;
