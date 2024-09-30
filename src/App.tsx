import React, { useState, useRef } from 'react';
import { ref, set } from "firebase/database";
import { db } from './firebaseConfig';
import './index.css';
import html2pdf from 'html2pdf.js';
import axios from 'axios';



interface Negocio {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  zipCode: string;
  buscarConIa: string;
}

const categorias = ['Servicios', 'Productos', 'Tecnología', 'Arte'];

// Componente Modal
const Modal = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">Respuesta de OpenAI</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl p-2"
            aria-label="Cerrar"
          >
            &#x2715;
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="text-lg text-gray-700">
          {children}
        </div>

        {/* Botón de continuación */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};



const Comunidad = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [buscarConIa, setBuscarConIa] = useState('');  
  const [respuestaOpenAi, setRespuestaOpenAi] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false);  // Controla la visibilidad del modal

  const pageRef = useRef(null);

  // Función para guardar negocio en Firebase
  const guardarNegocioEnFirebase = (negocio: Negocio) => {
    const negocioRef = ref(db, 'negocios/' + negocio.id); 
    set(negocioRef, negocio)
      .then(() => {
        console.log("Negocio guardado en Firebase:", negocio);
      })
      .catch((error) => {
        console.error("Error al guardar negocio en Firebase: ", error);
      });
  };

  // Función para guardar la página como PDF
  const handlePrint = () => {
    const element = pageRef.current; 
    html2pdf()
      .from(element)
      .save();
  };

  // Función para hacer la solicitud a la API de OpenAI
  const llamarApiOpenAI = async (texto) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',  // Verifica que esta URL sea correcta
        {
          model: 'gpt-4',  
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: texto }
          ],
          max_tokens: 100  // Ajusta los tokens según lo que necesites
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk-RRoI0ctw3so1Uyq_gmNkFz8byV5e3qU3e8GiV8HWY_T3BlbkFJbc7d8d6_cPkZ4v9SDjAm5eAH3rHlSLVqChAcbQTioA`,  // Reemplaza con tu clave válida
          },
        }
      );
      const respuesta = response.data.choices[0].message.content.trim();
      setModalVisible(true);  // Muestra el modal
      setRespuestaOpenAi(respuesta);  // Guarda la respuesta en el estado
    } catch (error) {
      console.error("Error al llamar a la API de OpenAI: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoNegocio = {
      id: Math.floor(Math.random() * 1000),
      nombre,
      descripcion,
      categoria,
      zipCode,
      buscarConIa
    };
    guardarNegocioEnFirebase(nuevoNegocio);
    llamarApiOpenAI(buscarConIa);
    setNombre('');
    setDescripcion('');
    setCategoria('');
    setZipCode('');
    setBuscarConIa('');
  };



  
  return (
    <div ref={pageRef} className="flex w-full h-screen py-0 px-0 overflow-hidden">
      {/* Sección de texto e input */}
      <div className="w-1/2 flex flex-col justify-center pl-16 pr-8">
        <h1 className="text-4xl font-bold leading-tight">
          Tenemos lo que buscas.
        </h1>
        <div className="flex space-x-8 mt-4">
          <button className="text-customBlue font-semibold hover:text-blue-800">
            HIRE A PRO
          </button>
          <button className="text-customBlue font-semibold hover:text-blue-800">
            FIND CUSTOMERS
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Describe your project or problem"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none w-full"
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none w-full"
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none w-full"
            />

            {/* Nuevo Input para buscarConIa */}
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                placeholder="Buscar con IA"
                value={buscarConIa}
                onChange={(e) => setBuscarConIa(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none flex-grow"
              />

              {/* Botón Search */}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Search
              </button>

              {/* Botón Imprimir al lado de Search */}
              <button 
                type="button"
                onClick={handlePrint} 
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Imprimir
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Prueba: <a href="#" className="text-blue-600">Necesito unas flores de regalo</a> o{' '}
            <a href="#" className="text-blue-600">Quiero un servicio de mensajería</a>
          </p>
        </form>

        {/* Componente Modal para la respuesta de OpenAI */}
        <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <h2 className="text-2xl font-semibold mb-4">Respuesta de OpenAI</h2>
          <p className="text-lg text-gray-700">
            {respuestaOpenAi}
          </p>
        </Modal>
      </div>

      <div className="w-1/2">
        <img
          src="https://production-next-images-cdn.thumbtack.com/i/453080952111751169/width/1024.webp"
          alt="Imagen de fondo"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Comunidad;
