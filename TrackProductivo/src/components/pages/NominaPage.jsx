import React, { useState } from "react";
import GlobalModal from "./HomePage";
import { Button } from "@nextui-org/react";
import ComponentSeguimiento from '../molecules/ComponentSeguimiento'

const ExamplePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button onPress={handleOpenModal}>Abrir Modal</Button>
      
      <GlobalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Título del Modal"
        bodyContent={<ComponentSeguimiento/>}
        footerActions={[
          {
            label: "Cerrar",
            color: "danger",
            onPress: handleCloseModal,
          },
          {
            label: "Acción",
            color: "primary",
            onPress: () => console.log("Acción realizada"),
          },
        ]}
      />
    </div>
  );
};

export default ExamplePage;