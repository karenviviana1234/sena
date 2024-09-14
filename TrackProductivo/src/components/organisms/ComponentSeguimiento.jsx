import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useProviderContext,
} from "@nextui-org/react";
import v from "../../styles/Variables.jsx";
import PDFUploader from "../molecules/Pdf.jsx";
import axiosClient from "../../configs/axiosClient.jsx";
import ButtonEnviar from "../atoms/ButtonEnviar.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";
import axios from "axios";
import ModalAcciones from "./ModalAcciones.jsx";
import Novedad from "./Novedad.jsx";

function ComponentSeguimiento({
  initialData,
  mode,
  handleSubmit,
  onClose,
  actionLabel,
  id_seguimiento, // Asegúrate de que este prop está siendo recibido correctamente
  onIdSend, // Callback para enviar el ID
}) {
  const [fecha, setFecha] = useState("");
  const [bitacora, setBitacora] = useState("");
  const [seguimientoPdf, setSeguimientoPdf] = useState(null);
  const [bitacoraPdf, setBitacoraPdf] = useState(null); // Estado para PDF de bitácora
  const [idPersona, setIdPersona] = useState("");
  const [estadoActaVisible, setEstadoActaVisible] = useState(false);
  const [estadoBitacoraVisible, setEstadoBitacoraVisible] = useState(false);
  const [bitacorasPdfs, setBitacorasPdfs] = useState([]);
  const [modalBitacora, setModalBitacora] = useState(false);

  const seguimientoNumeros = {
    1: 1,
    2: 2,
    3: 3,
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setFecha(currentDate);
    const userJson = localStorage.getItem("user");
    if (
      userJson &&
      userJson !== "undefined" &&
      userJson !== "null" &&
      userJson !== ""
    ) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.id_persona) {
          setIdPersona(user.id_persona);
          console.log("ID de persona asignado:", user.id_persona);
        } else {
          console.log("No se encontró un 'id_persona' válido en el usuario.");
        }
      } catch (error) {
        console.error("Error al parsear el JSON del usuario:", error);
      }
    } else {
      console.log(
        "No se encontró un valor válido para 'user' en localStorage."
      );
      setIdPersona(null);
    }

    if (onIdSend && id_seguimiento) {
      onIdSend(id_seguimiento);
    }
  }, [id_seguimiento, onIdSend]);

  useEffect(() => {
    if (id_seguimiento) {
      axiosClient
        .get(`/bitacoras/bitacorasSeguimiento/${id_seguimiento}`)
        .then((response) => {
          setBitacorasPdfs(response.data); // Guardamos las bitácoras obtenidas en el estado
        })
        .catch((error) => {
          console.error("Error al obtener las bitácoras:", error);
        });
    }
  }, [id_seguimiento]);

  // Función para manejar la carga del archivo de acta
  const handleActaPdfSubmit = (file) => {
    setSeguimientoPdf(file);
    setEstadoActaVisible(true);
  };

  // Función para manejar la carga del archivo de bitácora
  const handleBitacoraPdfSubmit = (file) => {
    setBitacoraPdf(file);
    setEstadoBitacoraVisible(true);
  };

  // Función para enviar el acta
  const handleSubmitActa = async () => {
    if (!id_seguimiento) {
      console.error("ID de seguimiento no definido");
      alert("ID de seguimiento no definido");
      return;
    }

    const formData = new FormData();
    if (seguimientoPdf) {
      formData.append("seguimientoPdf", seguimientoPdf);
    }

    try {
      const response = await axiosClient.post(
        `/seguimientos/cargarPDF/${id_seguimiento}`, // Usa id_seguimiento aquí
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Acta enviada correctamente");
        if (handleSubmit) handleSubmit();
      } else {
        alert("Error al enviar el Acta.");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  // Función para enviar la bitácora
  const handleSubmitBitacoras = async (bitacora) => {
    const formData = new FormData();
    formData.append("fecha", fecha);
    formData.append("bitacora", bitacora); // Número de bitácora fijo
    formData.append("seguimiento", 1);
    formData.append("instructor", idPersona);

    if (bitacoraPdf) {
      formData.append("bitacoraPdf", bitacoraPdf);
    } else {
      console.warn("No se ha seleccionado ningún archivo PDF.");
    }

    try {
      const response = await axiosClient.post(
        `/bitacoras/cargarpdf/${bitacora}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Bitacora registrada correctamente");
        if (handleSubmit) handleSubmit();
      } else {
        alert("Error al registrar la bitacora.");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  const [findBitacora, setFindBitacora] = useState([]);

  const handleBuscar = (id) => {
    axiosClient.get(`/bitacoras/buscar/${id}`).then((response) => {
      console.log("Bitacora a editar", response.data);
      setFindBitacora(response.data);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">
        Seguimiento {seguimientoNumeros[id_seguimiento] || 1}{" "}
        {/* Mostrar el número de seguimiento */}
      </h1>
      {/* Sección para enviar acta */}
      <h1 className="font-semibold text-xl">Acta:</h1>
      <div className="border shadow-medium rounded-2xl p-4 flex flex-col gap-4 relative h-32">
        <h2 className="font-semibold text-lg absolute top-4 left-4">
          Acta N° {seguimientoNumeros[id_seguimiento] || 1} :
        </h2>
        <div className="flex justify-center items-center h-full">
          <PDFUploader onFileSelect={handleActaPdfSubmit} />
          <ButtonEnviar onClick={handleSubmitActa} />
        </div>
        {estadoActaVisible && (
          <div className="absolute top-4 left-4 flex items-center gap-2 ml-24">
            <Chip
              endContent={<v.solicitud size={20} />}
              variant="flat"
              color="warning"
            >
              Solicitud
            </Chip>
          </div>
        )}
        {estadoActaVisible && (
          <p className="absolute bottom-4 right-4 text-gray-500 text-sm">
            {fecha}
          </p>
        )}
      </div>

      {/* Sección para registrar bitácoras y actividades */}
      <div className="flex gap-8">
        {/* Sección para registrar bitácoras y lista las bitacoras correspondientes */}
        <div className="flex-1 min-w-[300px] p-4">
          <h1 className="font-semibold text-xl">Bitácoras:</h1>
          <div className="flex flex-col gap-4">
            {bitacorasPdfs.length > 0 ? (
              bitacorasPdfs.map((bitacora) => (
                <div
                  key={bitacora.id_bitacora}
                  className="border shadow-medium rounded-2xl p-4 flex flex-col gap-4 relative"
                >
                  <h2 className="font-semibold text-lg">
                    Bitácora {bitacora.id_bitacora}
                  </h2>
                  <h2 className=" text-lg">Estado: {bitacora.estado}</h2>
                  <div className="flex justify-center items-center gap-4">
                    <PDFUploader
                      onFileSelect={(file) =>
                        handleBitacoraPdfSubmit(file, bitacora.id_bitacora)
                      }
                    />
                    <ButtonEnviar
                      onClick={() =>
                        handleSubmitBitacoras(
                          bitacora.id_bitacora,
                          bitacora.bitacoraPdf
                        )
                      }
                    />
                  </div>

                  {bitacora.bitacoraPdf && (
                    <div className="absolute top-4 left-28 flex items-center gap-2">
                      <Chip
                        endContent={<v.solicitud size={20} />}
                        variant="flat"
                        color="warning"
                      >
                        Archivo listo
                      </Chip>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No hay bitácoras disponibles.</p>
            )}
          </div>
        </div>

        {/* Sección para actividades */}
        <div className="flex-1 min-w-[300px]  p-4">
          <h1 className="font-semibold mb-4 text-xl">Novedades:</h1>
         <Novedad/>
        </div>
      </div>
      {/*       <div className="flex flex-col w-[600px]">
        <h2 className="font-semibold mb-4 text-xl"> Bitacoras asociadas al seguimiento: </h2>
            {bitacorasPdfs.map((bita) => (
              <div key={bita.id_bitacora} className="flex flex-row">
                <p className="text-xl font-semibold mr-5"> Bitacora {bita.bitacora} : </p>
                <p className="text-lg font-medium mr-5"> {bita.pdf} </p>
                <button className="bg-[#6fb12d] text-white p-2 rounded-xl mb-3 font-semibold" onClick={() => [handleBuscar(bita.id_bitacora), setModalBitacora(true)]}> Editar </button>
              </div>
            ))}
      </div> */}
      <Modal isOpen={modalBitacora} onClose={() => setModalBitacora(false)}>
        <ModalContent>
          <ModalHeader>
            <h2> Actualizar Bitacora </h2>
          </ModalHeader>

          <ModalBody className="overflow-y-auto max-h-[70vh]">
            {findBitacora.map((bita) => (
              <div>
                <Input type="text" value={bita.fecha} />
                <Input type="text" value={bita.pdf} />
                <Input type="text" value={bita.instructor} />
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onClick={() => setModalBitacora(false)}
            >
              {" "}
              Cerrar{" "}
            </Button>
            <Button className="bg-[#6fb12d] text-white font-semibold">
              {" "}
              Actualizar{" "}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ComponentSeguimiento;
