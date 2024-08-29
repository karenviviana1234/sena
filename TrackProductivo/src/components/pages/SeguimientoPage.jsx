import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TableSeguimientos from '../organisms/TableSeguimientos';
import axiosClient from '../../configs/axiosClient';

function SeguimientosPage() {
        const [programas, setProgramas] = useState([]);
    
        useEffect(() => {
            const fetchProgramas = async () => {
                try {
                    const response = await axiosClient.get('/programa/listar');
                    setProgramas(response.data);
                } catch (error) {
                    console.error('Error al obtener programas:', error);
                }
            };
    
            fetchProgramas();
        }, []);
    
    return (
        <div className="flex flex-col m-10">
            <Tabs aria-label="Options">
            {programas.map((programa) => (
                    <Tab key={programa.sigla} title={programa.sigla}>
                        <TableSeguimientos />
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}

export default SeguimientosPage;
