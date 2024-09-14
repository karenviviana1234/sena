import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';


export const exportToExcel = async (matriculas) => {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    
    // Agregar una hoja para las matrículas
    const sheetMatriculas = workbook.addWorksheet('Matrículas');
    
    // Configurar encabezados para la hoja de matrículas
    sheetMatriculas.columns = [
        { header: 'ID', key: 'id_matricula' },
        { header: 'Ficha', key: 'ficha' },
        { header: 'Nombre', key: 'Persona.nombres' },
        { header: 'Identificación', key: 'Persona.identificacion' },
        { header: 'Correo', key: 'Persona.correo' },
        { header: 'Teléfono', key: 'Persona.telefono' },
        { header: 'Estado', key: 'estado' },
        { header: 'Técnicos Pendientes', key: 'pendiente_tecnicos' },
        { header: 'Transversales Pendientes', key: 'pendiente_transversales' },
        { header: 'Inglés Pendiente', key: 'pendiente_ingles' },
    ];
    
    // Agregar datos de matrículas
    sheetMatriculas.addRows(matriculas);
    
    // Formatear la tabla
    sheetMatriculas.views = [
        {
            x: 0,
            y: 0,
            width: 10000,
            height: 200,
            firstColumn: 0,
            firstRow: 0,
            activeCell: 'A1'
        }
    ];

    sheetMatriculas.autoFilter = {
        from: 'A1',
        to: 'I1'
    };

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Descargar el archivo
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
    FileSaver.saveAs(blob, `matriculas_ficha_${matriculas[0]?.ficha || ''}.xlsx`);
};