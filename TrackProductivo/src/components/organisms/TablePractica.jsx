import { useState, useEffect } from 'react';
import { Table, TableHeader, TableCell, TableRow, TableBody } from '@nextui-org/react';
import CustomFileInput from '../NextIU/molecules/CustomFileInput';
import PropTypes from 'prop-types';
import ErrorBoundary from '../NextIU/Error/ErrorBoundary';

const TablePractica = ({ productivas }) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        setError("Ocurrió un error");
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <ErrorBoundary fallback={<div>Algo salió mal</div>}>
            <Table aria-label="Table with custom cells">
                <TableHeader>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Edad</TableCell>
                        <TableCell>Rol</TableCell>
                        <TableCell>Equipo</TableCell>
                        <TableCell>Correo electrónico</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productivas.map((productiva) => (
                        <TableRow key={productiva.id}>
                            <TableCell>{productiva.id}</TableCell>
                            <TableCell>{productiva.name}</TableCell>
                            <TableCell>{productiva.age}</TableCell>
                            <TableCell>{productiva.role}</TableCell>
                            <TableCell>{productiva.team}</TableCell>
                            <TableCell>{productiva.email}</TableCell>
                            <TableCell>{productiva.status}</TableCell>
                            <TableCell>
                                <CustomFileInput onChange={(e) => console.log(e.target.files[0])} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ErrorBoundary>
    );
};

TablePractica.propTypes = {
    productivas: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        role: PropTypes.string.isRequired,
        team: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['active', 'paused', 'vacation']).isRequired,
    })).isRequired,
    onRefresh: PropTypes.func.isRequired,
};

export default TablePractica;
