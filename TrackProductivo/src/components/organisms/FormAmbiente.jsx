import React, { useState, useEffect, useMemo } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";
import GlobalAlert from "../../components/molecules/ComponentsGlobals/GlobalAlert";
import GlobalModal from "../../components/componets_globals/GlobalModal";
import { useDisclosure } from "@nextui-org/react";

export const RegistroAmbiente = ({ onRegisterSuccess }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ambienteData, setAmbienteData] = useState({
        nombre_amb: "",
        municipio: "",
        sede: ""
    });
    const [municipios, setMunicipios] = useState([]);
    const [error, setError] = useState("");
    const [selectedMunicipio, setSelectedMunicipio] = useState("");

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAmbienteData({ ...ambienteData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!ambienteData.nombre_amb || !ambienteData.municipio || !ambienteData.sede) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const response = await axiosClient.post("/ambientes/registrar", ambienteData);
            console.log("Respuesta del servidor:", response.data);
            GlobalAlert.success("Ambiente registrado correctamente.");
            setAmbienteData({
                nombre_amb: "",
                municipio: "",
                sede: ""
            });
            setSelectedMunicipio("");
            onClose();
            if (onRegisterSuccess) onRegisterSuccess();
        } catch (error) {
            console.error("Error al registrar el ambiente:", error.response?.data || error);
            GlobalAlert.error("Hubo un error al registrar el ambiente.");
        }
    };

    useEffect(() => {
        const fetchMunicipios = async () => {
            try {
                const response = await axiosClient.get("/municipios/listar");
                console.log("Respuesta de la API:", response.data);

                // Asegúrate de que cada municipio tenga una propiedad 'id_municipio' y 'nombre_municipio'
                const formattedMunicipios = response.data.map(municipio => ({
                    id_municipio: String(municipio.id_municipio),
                    nombre_municipio: municipio.nombre_municipio
                }));

                setMunicipios(formattedMunicipios);
            } catch (error) {
                console.error("Error al obtener los municipios:", error);
                GlobalAlert.error("Hubo un error al cargar los municipios.");
            }
        };
        fetchMunicipios();
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <div className="relative z-20 flex items-center justify-end gap-3">
                <Button
                    onPress={onOpen}
                    className="bg-[#92d22e] text-white absolute top-0 z-30"
                >
                    Registrar Ambiente
                </Button>
            </div>

            <GlobalModal
                isOpen={isOpen}
                onOpenChange={onClose}
                title="Registro de Ambientes"
                children={
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Nombre del Ambiente"
                            placeholder="Ingresa el nombre del ambiente"
                            name="nombre_amb"
                            value={ambienteData.nombre_amb}
                            onChange={handleInputChange}
                            required
                        />
                        <Select
                            label="Municipio"
                            placeholder="Seleccione un municipio"
                            name="municipio"
                            value={selectedMunicipio}
                            onChange={(value) => {
                                setSelectedMunicipio(value);
                                setAmbienteData(prev => ({ ...prev, municipio: value }));
                            }}
                            required
                        >
                            {municipios.map((municipio) => (
                                <SelectItem key={municipio.id_municipio} value={municipio.id_municipio}>
                                    {municipio.nombre_municipio}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Sede"
                            placeholder="Seleccione una sede"
                            name="sede"
                            value={ambienteData.sede}
                            onChange={handleInputChange}
                            required
                        >
                            <SelectItem value="centro">Centro</SelectItem>
                            <SelectItem value="yamboro">Yamboro</SelectItem>
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

export default RegistroAmbiente;
