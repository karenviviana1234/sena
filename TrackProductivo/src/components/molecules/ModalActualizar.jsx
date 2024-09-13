import React, { useState } from 'react';
import axiosClient from '../../configs/axiosClient';

function ModalActualizar({ onClose, novedad }) {
    const [instructor, setInstructor] = useState(novedad.instructor);
    const [descripcion, setDescripcion] = useState(novedad.descripcion);
    const [fecha, setFecha] = useState(novedad.fecha);
    const [foto, setFoto] = useState(null);

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('instructor', instructor);
        formData.append('descripcion', descripcion);
        formData.append('fecha', fecha);
        if (foto) {
            formData.append('foto', foto);
        }

        axiosClient.put(`/novedad/actualizar/${novedad.id_novedad}`, formData)
            .then(response => {
                // Maneja la respuesta exitosa
                console.log('Novedad actualizada:', response.data);
                onClose(); // Cierra el modal después de la actualización
            })
            .catch(error => {
                // Maneja el error
                console.error('Error al actualizar la novedad:', error);
            });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Actualizar Novedad</h2>
                <div className="form-group">
                    <label htmlFor="instructor">Instructor</label>
                    <input
                        type="text"
                        id="instructor"
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fecha">Fecha</label>
                    <input
                        type="date"
                        id="fecha"
                        value={new Date(fecha).toISOString().split('T')[0]}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="foto">Foto</label>
                    <input
                        type="file"
                        id="foto"
                        onChange={(e) => setFoto(e.target.files[0])}
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={handleUpdate} className="btn-update">Actualizar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalActualizar;
