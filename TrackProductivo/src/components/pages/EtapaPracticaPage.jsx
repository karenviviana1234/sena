import React, { useState, useEffect } from 'react';
import TablePractica from '../organisms/TablePractica';
import FormEtapaPractica from '../organisms/FormEtapaPractica';
import axiosClient from '../../configs/axiosClient';

const EtapaPractica = () => {
  const [productivas, setProductivas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductivas = async () => {
    try {
      const response = await axiosClient.get('/productiva/listar');
      setProductivas(response.data.map(item => ({
        ...item,
        fecha_inicio: new Date(item.fecha_inicio).toISOString(),
        fecha_fin: new Date(item.fecha_fin).toISOString(),
        acuerdo: item.acuerdo ? 'Archivo adjunto' : '-',
        arl: item.arl ? 'Archivo adjunto' : '-',
        consulta: item.consulta ? 'Archivo adjunto' : '-',
      })));
    } catch (error) {
      console.error('Error listando productivas:', error.message);
    }
  };

  useEffect(() => {
    fetchProductivas();
  }, []);

  const handleRefreshList = () => {
    fetchProductivas();
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Registrar Etapa Practica</button>
      <TablePractica productivas={productivas} onRefresh={handleRefreshList} />
      <FormEtapaPractica
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={handleRefreshList}
      />
    </div>
  );
};

export default EtapaPractica;
