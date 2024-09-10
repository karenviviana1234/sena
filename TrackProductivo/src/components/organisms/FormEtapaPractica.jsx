import React, { useState } from 'react';
import { Input, Select, Button } from '@nextui-org/react';

function FormEtapaPractica({ etapa, onSave }) {
    const [nombre, setNombre] = useState(etapa ? etapa.nombre : '');
    const [descripcion, setDescripcion] = useState(etapa ? etapa.descripcion : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newEtapa = {
            nombre,
            descripcion,
        };
        await onSave(newEtapa);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            <Input
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                textarea
            />
            <Button type="submit">{etapa ? 'Actualizar' : 'Guardar'} Etapa Práctica</Button>
        </form>
    );
}

export default FormEtapaPractica;
