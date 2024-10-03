import { useState, useEffect } from 'react';
import GlobalTable from '../molecules/ComponentsGlobals/GlobalTable';
import RegistroAmbiente from './FormAmbiente';
import ActualizarAmbiente from './ActualizarAmbiente';
import axiosClient from '../../configs/axiosClient';

function TableAmbiente() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [municipios, setMunicipios] = useState({});
    const [ambientes, setAmbientes] = useState([]);

    useEffect(() => {
        fetchMunicipios();
        fetchAmbientes();
    }, []);

    const handleRegister = () => {
        setRefreshTrigger(prev => !prev);
    };

    const fetchMunicipios = async () => {
        try {
            const response = await axiosClient.get('/municipios/listar');
            const municipiosObj = {};
            response.data.forEach(municipio => {
                municipiosObj[municipio.id_municipio] = municipio.nombre_mpio;
            });
            setMunicipios(municipiosObj);
        } catch (error) {
            console.error('Error al cargar los municipios:', error);
        }
    };

    const fetchAmbientes = async () => {
        try {
            const response = await axiosClient.get('/ambientes/listar');
            setAmbientes(response.data);
        } catch (error) {
            console.error('Error al cargar los ambientes:', error);
        }
    };

    const columns = [
        { key: 'id_ambiente', label: 'ID Ambiente' },
        { key: 'nombre_amb', label: 'Nombre del Ambiente' },
        { 
            key: 'municipio', 
            label: 'Municipio',
            renderCell: (row) => {
                return row.municipio ? municipios[row.municipio] || 'Municipio no encontrado' : '-';
            }
        },
        { key: 'sede', label: 'Sede' },
        { key: 'estado', label: 'Estado' },
    ];

    return (
        <>
            <main className='w-full p-3 h-screen'>
                <div className='my-5 flex flex-col py-5'>
                    <RegistroAmbiente onRegisterSuccess={handleRegister} />
                    <GlobalTable
                        columns={columns}
                        dataEndpoint="/ambientes/listar"
                        refreshTrigger={refreshTrigger}
                        updateComponent={ActualizarAmbiente}
                        contentName="ambientes"
                        activateEndpoint="/ambientes/activar/"
                        deactivateEndpoint="/ambientes/inactivar/"
                        idField="id_ambiente"
                        data={ambientes}
                    />
                </div>
            </main>
        </>
    );
};

export default TableAmbiente;
