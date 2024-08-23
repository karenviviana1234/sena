import React from 'react';
import FormAsignacion from '../organisms/FormAsignacion.jsx';
import AccionesModal from '../molecules/Modal.jsx';

function AsignacionModal({ open, onClose, handleSubmit, actionLabel, title, initialData, mode }) {
    return (
        <>
            <AccionesModal open={open} title={title} onClose={onClose} >
                <FormAsignacion initialData={initialData} mode={mode} handleSubmit={handleSubmit} onClose={onClose} actionLabel={actionLabel} />
            </AccionesModal>

        </>
    )
}
export default AsignacionModal
