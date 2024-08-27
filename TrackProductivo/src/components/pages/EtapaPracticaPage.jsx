import { useState, useEffect } from 'react';
import axiosClient from '../../configs/axiosClient.jsx';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Textarea,
} from "@nextui-org/react";
import { SearchIcon } from "../NextIU/atoms/searchicons.jsx";

const EtapaPractica = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('/productiva/listar');
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const updateProductiva = async (id, newData) => {
    try {
      await axiosClient.put(`/productiva/actualizar/${id}`, newData);
      fetchData(); // Refrescar los datos después de la actualización
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const openModal = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <Button onClick={() => openModal()}>Registrar Nueva Etapa Práctica</Button>
      <Table aria-label="Tabla de Etapas Prácticas">
        <TableHeader>
          <TableColumn>Matrícula</TableColumn>
          <TableColumn>Empresa</TableColumn>
          <TableColumn>Fecha de inicio</TableColumn>
          <TableColumn>Fecha de fin</TableColumn>
          <TableColumn>Alternativa</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Aprendiz</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.matricula}</TableCell>
              <TableCell>{item.empresa}</TableCell>
              <TableCell>{item.fecha_inicio.slice(0, 4) + '-' + item.fecha_inicio.slice(5, 7) + '-' + item.fecha_inicio.slice(8, 10)}</TableCell>
              <TableCell>{item.fecha_fin.slice(0, 4) + '-' + item.fecha_fin.slice(5, 7) + '-' + item.fecha_fin.slice(8, 10)}</TableCell>
              <TableCell>{item.alternativa}</TableCell>
              <TableCell>{item.estado}</TableCell>
              <TableCell>{item.aprendiz}</TableCell>
              <TableCell>
                <Button onClick={() => openModal(item)}><SearchIcon /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Title>Etapa Práctica</Modal.Title>
        <Modal.Content>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!selectedItem) {
              createProductiva();
            } else {
              updateProductiva(selectedItem.id, formValues());
            }
            setIsModalOpen(false);
          }}>
            <Input label="Matrícula" value={selectedItem?.matricula || ''} readOnly />
            <Input label="Empresa" onChange={(e) => handleInputChange('empresa', e.target.value)} />
            <DatePicker label="Fecha de inicio" value={selectedItem?.fecha_inicio || new Date()} onChange={(date) => handleDateChange('fecha_inicio', date)} />
            <DatePicker label="Fecha de fin" value={selectedItem?.fecha_fin || new Date()} onChange={(date) => handleDateChange('fecha_fin', date)} />
            <Select label="Alternativa" options={['Opcional', 'Requerida']} onChange={(value) => handleSelectChange('alternativa', value)} />
            <Textarea label="Descripción" onChange={(e) => handleInputChange('descripcion', e.target.value)} />
            <Select label="Estado" options={['Activo', 'Inactivo']} onChange={(value) => handleSelectChange('estado', value)} />
            <Button type="submit">{selectedItem ? 'Actualizar' : 'Registrar'}</Button>
          </form>
        </Modal.Content>
      </Modal>
    </>
  );

  function formValues() {
    return {
      empresa: selectedItem?.empresa || '',
      fecha_inicio: selectedItem?.fecha_inicio || new Date(),
      fecha_fin: selectedItem?.fecha_fin || new Date(),
      alternativa: selectedItem?.alternativa || '',
      descripcion: selectedItem?.descripcion || '',
      estado: selectedItem?.estado || '',
      aprendiz: selectedItem?.aprendiz || ''
    };
  }

  function handleInputChange(name, value) {
    setSelectedItem(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  function handleDateChange(name, date) {
    setSelectedItem(prevState => ({
      ...prevState,
      [name]: date.toISOString()
    }));
  }

  function handleSelectChange(name, value) {
    setSelectedItem(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  function createProductiva() {
    // Implementar lógica para crear una nueva etapa práctica
    // Puede requerirse una función adicional en el componente padre para manejar esto
  }

  /*  return null; */ // Esto es solo para evitar advertencias de TypeScript
};

export default EtapaPractica;