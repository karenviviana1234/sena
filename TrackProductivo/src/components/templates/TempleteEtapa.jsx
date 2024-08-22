import React from 'react';
import FormEtapa from '../molecules/FormEtapa.jsx'
import AccionesModal from '../molecules/Modal.jsx';

function EtapaModal({ open, onClose, handleSubmit, actionLabel, title, initialData, mode }) {
    return (
        <>
            <AccionesModal open={open} title={title} onClose={onClose} >
                <FormEtapa initialData={initialData} mode={mode} handleSubmit={handleSubmit} onClose={onClose} actionLabel={actionLabel} />
            </AccionesModal>

        </>
    )
}
export default EtapaModal
