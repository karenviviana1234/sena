import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";
import GlobalAlert from "../../components/componets_globals/GlobalAlert";
import GlobalModal from "../../components/componets_globals/GlobalModal";
import { useDisclosure } from "@nextui-org/react";
import { Calendar } from 'lucide-react';

export const RegistroFicha = ({ onRegisterSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fichaData, setFichaData] = useState({
    codigo: "",
    inicio_ficha: "",
    fin_lectiva: "",
    fin_ficha: "",
    programa: "",
    sede: ""
  });
  const [programas, setProgramas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const response = await axiosClient.get("/programa/listar");
        const uniqueProgramas = response.data.reduce((acc, curr) => {
          if (!acc.find(p => p.id_programa === curr.id_programa)) {
            acc.push({ id_programa: curr.id_programa, nombre_programa: curr.nombre_programa });
          }
          return acc;
        }, []);
        setProgramas(uniqueProgramas);
      } catch (error) {
        console.error("Error al obtener los programas:", error);
        GlobalAlert.error("Hubo un error al obtener los programas.");
      }
    };
    fetchProgramas();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFichaData({ ...fichaData, [name]: value });
  };

  const handleDateChange = (name, value) => {
    setFichaData({ ...fichaData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fichaData.codigo || !fichaData.inicio_ficha || !fichaData.fin_lectiva || !fichaData.fin_ficha || !fichaData.programa || !fichaData.sede) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axiosClient.post("/fichas/registrar", fichaData);
      console.log("Respuesta del servidor:", response.data);
      GlobalAlert.success("Ficha registrada correctamente.");
      setFichaData({
        codigo: "",
        inicio_ficha: "",
        fin_lectiva: "",
        fin_ficha: "",
        programa: "",
        sede: ""
      });
      onClose();
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error) {
      console.error("Error al registrar la ficha:", error.response?.data || error);
      GlobalAlert.error("Hubo un error al registrar la ficha.");
    }
  };

  const DateInput = ({ label, name, value, onChange }) => (
    <Popover>
      <PopoverTrigger>
        <Input
          type="number"
          label='Numero de Ficha'
          id='codigo'
          name="codigo"
          className="w-96"
          value={value}
          endContent={<Calendar className="text-default-400" />}
          readOnly
        />
      </PopoverTrigger>
      <PopoverContent>
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="max-w-xs"
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <Button onPress={onOpen} className="bg-[#90d12c] text-white">Registrar Ficha</Button>
      </div>
      <GlobalModal
        isOpen={isOpen}
        onOpenChange={onClose}
        title="Registro de Ficha"
        children={
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Código de Ficha"
              className="w-96"
              placeholder="Ingresa el código de la ficha"
              name="codigo"
              value={fichaData.codigo}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Inicio de Ficha"
              type="date"
              name="inicio_ficha"
              value={fichaData.inicio_ficha}
              className="w-96"
              onChange={handleDateChange}
            />
            <Input
              label="Fin Lectiva"
              type="date"
              className="w-96"
              name="fin_lectiva"
              value={fichaData.fin_lectiva}
              onChange={handleDateChange}
            />
            <Input
              label="Fin de Ficha"
              type="date"
              name="fin_ficha"
              className="w-96"
              value={fichaData.fin_ficha}
              onChange={handleDateChange}
            />
            <Select
              label="Programa"
              placeholder="Seleccione un programa"
              className="w-96"
              name="programa"
              value={fichaData.programa}
              onChange={handleInputChange}
              required
            >
              {programas.map((programa) => (
                <SelectItem key={programa.id_programa} value={programa.id_programa}>
                  {programa.nombre_programa}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Sede"
              placeholder="Seleccione una sede"
              className="w-96"
              name="sede"
              value={fichaData.sede}
              onChange={handleInputChange}
              required
            >
              <SelectItem key="centro" value="centro">Centro</SelectItem>
              <SelectItem key="yamboro" value="yamboro">Yamboro</SelectItem>
            </Select>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end gap-5 mr-5 my-5">
              <Button className="bg-[#92d22e] text-white" type="submit" color="success">
                Registrar
                </Button>
            </div>
          </form>
        }
      />
    </div>
  );
};

export default RegistroFicha;