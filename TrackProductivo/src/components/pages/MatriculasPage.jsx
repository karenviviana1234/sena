import { useState, useEffect } from 'react';
import axios from 'axios';

// Configura la URL base de tu API
const API_URL = 'http://localhost:3000/api'; // Ajusta esta URL según tu configuración de backend

function MatriculasPage() {
  const [matriculas, setMatriculas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState('');

  // Simula la obtención de fichas y aprendices
  const fichas = [
    { id: '1', nombre: 'Ficha 1' },
    { id: '2', nombre: 'Ficha 2' }
  ];
  const aprendices = [
    { id: '1', nombre: 'Aprendiz 1', fichaId: '1' },
    { id: '2', nombre: 'Aprendiz 2', fichaId: '2' }
  ];

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const response = await axios.get(`${API_URL}/matriculas`);
        setMatriculas(response.data);
      } catch (error) {
        console.error('Error al cargar las matrículas:', error);
      }
    };

    fetchMatriculas();
  }, []);

  const handleRegister = async (data) => {
    try {
      await axios.post(`${API_URL}/matriculas`, data);
      alert('Matrícula registrada correctamente');
      setShowModal(false); // Cerrar el modal después de registrar
      // Aquí podrías también actualizar la lista de matrículas para reflejar el nuevo registro
    } catch (error) {
      console.error('Error al registrar la matrícula:', error);
    }
  };

  return (
    <>
      <main className='w-full p-3'>
        <h2>Matrículas</h2>

        {/* Seleccionar Ficha */}
        <select value={selectedFicha} onChange={(e) => setSelectedFicha(e.target.value)}>
          <option value="">Seleccione una ficha</option>
          {fichas.map(ficha => (
            <option key={ficha.id} value={ficha.id}>{ficha.nombre}</option>
          ))}
        </select>

        {/* Lista de Matrículas */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ficha</th>
              <th>Aprendiz</th>
              <th>Estado</th>
              {/* Agrega más columnas según sea necesario */}
            </tr>
          </thead>
          <tbody>
            {matriculas.map(matricula => (
              <tr key={matricula.id_matricula}>
                <td>{matricula.id_matricula}</td>
                <td>{matricula.ficha}</td>
                <td>{matricula.aprendiz}</td>
                <td>{matricula.estado}</td>
                {/* Agrega más celdas según sea necesario */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón para abrir el modal de registro */}
        <button onClick={() => setShowModal(true)}>Nueva Matrícula</button>

        {/* Modal para registrar nueva matrícula */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px' }}>
              <h2>Nueva Matrícula</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                // Assuming you have a state or a way to collect the form data
                const formData = { /* your form data */ };
                handleRegister(formData);
              }}>
                {/* Your form fields */}
                <button type="submit">Submit</button>
              </form>
              <button onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default MatriculasPage;
