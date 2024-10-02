import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";
import GlobalAlert from "../../components/molecules/ComponentsGlobals/GlobalAlert";
import GlobalModal from "../../components/componets_globals/GlobalModal";

const ActualizarAmbiente = ({ item, onClose, refreshData }) => {
    const [ambienteData, setAmbienteData] = useState({
        id_ambiente: "",
        nombre_amb: "",
        municipio: "",
        sede: ""
    });
    const [municipios, setMunicipios] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (item) {
            setAmbienteData({
                nombre_amb: item.nombre_amb,
                municipio: item.municipio,
                sede: item.sede
            });
        }
        fetchMunicipios();
    }, [item]);

    const fetchMunicipios = async () => {
        try {
            const response = await axiosClient.get("/municipios/listar");
            setMunicipios(response.data);
        } catch (error) {
            console.error("Error al obtener los municipios:", error);
            GlobalAlert.error("Hubo un error al cargar los municipios.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAmbienteData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!ambienteData.nombre_amb || !ambienteData.municipio || !ambienteData.sede) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const dataToSend = {
                id_ambiente: ambienteData.id_ambiente,
                nombre_amb: ambienteData.nombre_amb,
                municipio: ambienteData.municipio,
                sede: ambienteData.sede
            };

            const response = await axiosClient.put(`/ambientes/actualizar/${ambienteData.id_ambiente}`, dataToSend);

            console.log("Respuesta del servidor:", response.data);
            GlobalAlert.success("Ambiente actualizado correctamente.");
            refreshData();
            onClose();
        } catch (error) {
            console.error("Error al actualizar el ambiente:", error.response?.data || error);
            GlobalAlert.error("Hubo un error al actualizar el ambiente.");
        }
    };

    return (
        <GlobalModal
            isOpen={true}
            onOpenChange={onClose}
            title="Actualizar Ambiente"
            children={
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Nombre del Ambiente"
                        value={ambienteData.nombre_amb}
                        onChange={(e) => handleInputChange({ target: { name: 'nombre_amb', value: e.target.value } })}
                        required
                    />
                    <Select
                        label="Municipio"
                        placeholder="Seleccione un municipio"
                        name="municipio"
                        selectedKeys={ambienteData.municipio ? [ambienteData.municipio] : []}
                        onChange={(e) => handleInputChange({ target: { name: 'municipio', value: e.target.value } })}
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
                        selectedKeys={ambienteData.sede ? [ambienteData.sede] : []}
                        onChange={(e) => handleInputChange({ target: { name: 'sede', value: e.target.value } })}
                        required
                    >
                        <SelectItem key="centro" value="centro">Centro</SelectItem>
                        <SelectItem key="yamboro" value="yamboro">Yamboro</SelectItem>
                    </Select>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="flex justify-end gap-5 mr-5 my-5">
                        <Button className="bg-[#92d22e] text-white" type="submit" color="success">
                            Actualizar
                        </Button>
                    </div>
                </form>
            }
        />
    );
};

export default ActualizarAmbiente;
