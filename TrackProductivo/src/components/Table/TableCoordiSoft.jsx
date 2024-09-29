import React, { useEffect, useState } from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/react";
import axios from 'axios'

const TableCoordiSoft = () => {

    const [movimientos, setMovimientos] = useState([]);

    const columnsHeader = [
        { nombre: 'Código' },
        { nombre: 'Usuario' },
        { nombre: 'Tipo' },
        { nombre: 'Fecha Creación' },
        { nombre: 'Fecha Modificación' },
    ]

    const ListarMovimientos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/movimiento');
            console.log(response.data);
            setMovimientos(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        ListarMovimientos();
    }, []);

    return (
        <Table aria-label="Example static collection table">
            <TableHeader>
                {columnsHeader.map((column, index) => (
                    <TableColumn key={index}>{column.nombre}</TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                {movimientos.map((movimiento, index) => (
                    <TableRow key={index}>
                        <TableCell>{movimiento.id}</TableCell>
                        <TableCell>{movimiento.persona_movimiento.username}</TableCell>
                        <TableCell>{movimiento.tipo_movimiento.tipo_movimiento}</TableCell>
                        <TableCell>{movimiento.fecha_creacion}</TableCell>
                        <TableCell>{movimiento.fecha_modificacion}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TableCoordiSoft;