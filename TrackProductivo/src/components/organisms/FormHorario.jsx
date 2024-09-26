import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";
import GlobalAlert from "../../components/componets_globals/GlobalAlert";
import GlobalModal from "../../components/componets_globals/GlobalModal";
import { useDisclosure } from "@nextui-org/react";
import { Clock } from 'lucide-react';

export const RegistroHorario = ({ onRegisterSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [horarioData, setHorarioData] = useState({
    hora_inicio: "",
    hora_fin: "",
    dia: "",
    horas: "",
    ficha: "",
    ambiente: "",
  });
  const [fichas, setFichas] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const response = await axiosClient.get("/fichas/listar");
        setFichas(response.data);
      } catch (error) {
        console.error("Error al obtener las fichas:", error);
        GlobalAlert.error("Hubo un error al obtener las fichas.");
      }
    };

    const fetchAmbientes = async () => {
      try {
        const response = await axiosClient.get("/ambientes/listar");
        setAmbientes(response.data);
      } catch (error) {
        console.error("Error al obtener los ambientes:", error);
        GlobalAlert.error("Hubo un error al obtener los ambientes.");
      }
    };

    fetchFichas();
    fetchAmbientes();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setHorarioData({ ...horarioData, [name]: value });
  };

  const handleSelectChange = (name) => (e) => {
    setHorarioData({ ...horarioData, [name]: e.target.value });
  };

  const handleTimeChange = (name, value) => {
    setHorarioData({ ...horarioData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!horarioData.hora_inicio || !horarioData.hora_fin || !horarioData.dia || !horarioData.horas || !horarioData.ficha || !horarioData.ambiente) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axiosClient.post("/horarios/registrar", horarioData);
      console.log("Respuesta del servidor:", response.data);
      GlobalAlert.success("Horario registrado correctamente.");
      setHorarioData({
        hora_inicio: "",
        hora_fin: "",
        dia: "",
        horas: "",
        ficha: "",
        ambiente: "",
      });
      onClose();
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error) {
      console.error("Error al registrar el horario:", error.response?.data || error);
      GlobalAlert.error("Hubo un error al registrar el horario.");
    }
  };

  const TimeInput = ({ label, name, value, onChange }) => (
    <Popover>
      <PopoverTrigger>
        <Input
          label={label}
          placeholder="Selecciona una hora"
          value={value}
          endContent={<Clock className="text-default-400" />}
          readOnly
        />
      </PopoverTrigger>
      <PopoverContent>
        <Input
          type="time"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="max-w-xs"
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit">Registrar Horario</Button>
      <GlobalModal
        isOpen={isOpen}
        onOpenChange={onClose}
        title="Formulario de Registro de Horario"
        children={
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TimeInput
              label="Hora de Inicio"
              name="hora_inicio"
              value={horarioData.hora_inicio}
              onChange={handleTimeChange}
            />
            <TimeInput
              label="Hora de Fin"
              name="hora_fin"
              value={horarioData.hora_fin}
              onChange={handleTimeChange}
            />
            <Select
              label="Día"
              placeholder="Seleccione un día"
              name="dia"
              selectedKeys={horarioData.dia ? [horarioData.dia] : []}
              onChange={handleSelectChange("dia")}
              required
            >
              {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabados', 'domingo'].map((dia) => (
                <SelectItem key={dia} value={dia}>
                  {dia.charAt(0).toUpperCase() + dia.slice(1)}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Horas"
              placeholder="Ingrese el número de horas"
              name="horas"
              type="number"
              value={horarioData.horas}
              onChange={handleInputChange}
              required
            />
            <Select
              label="Ficha"
              placeholder="Seleccione una ficha"
              name="ficha"
              selectedKeys={horarioData.ficha ? [horarioData.ficha] : []}
              onChange={handleSelectChange("ficha")}
              required
            >
              {fichas.map((ficha) => (
                <SelectItem key={ficha.codigo.toString()} textValue={ficha.codigo.toString()}>
                  {ficha.codigo}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Ambiente"
              placeholder="Seleccione un ambiente"
              name="ambiente"
              selectedKeys={horarioData.ambiente ? [horarioData.ambiente] : []}
              onChange={handleSelectChange("ambiente")}
              required
            >
              {ambientes.map((ambiente) => (
                <SelectItem key={ambiente.id_ambiente.toString()} textValue={ambiente.nombre_amb}>
                  {ambiente.nombre_amb}
                </SelectItem>
              ))}
            </Select>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" color="primary">Registrar Horario</Button>
          </form>
        }
        footer={() => (
          <Button color="danger" variant="light" onClick={onClose}>
            Cerrar
          </Button>
        )}
      />
    </div>
  );
};

export default RegistroHorario;