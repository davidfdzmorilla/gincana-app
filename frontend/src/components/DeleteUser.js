import runnerService from "../services/runnerService";
import Spinner from "./Spinner";
const { useState, useEffect } = require("react");

const DeleteUser = () => {

  const [corredores, setCorredores] = useState([]);
  const [viewVuelta, setViewVuelta] = useState(false);
  const [vueltas, setVueltas] = useState([]);
  const [loading, setLoading] = useState(true);

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCorredores = async () => {
      try {
        const data = await runnerService.getCorredores();
        if (data && data.corredores) {
          setCorredores(data.corredores);
        } else {
          throw new Error("Formato de datos incorrecto");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar corredores:", err);
        setLoading(false);
      }
    };
    fetchCorredores();
  }, []);

  const handleDelete = async (id) => {
    const userId = id;
    try {
      if (!window.confirm("¿Estás seguro de que quieres eliminar este corredor?")) {
        return;
      }
      await runnerService.deleteCorredor(userId);
      setCorredores(corredores.filter((corredor) => corredor.user_id !== userId));
    } catch (err) {
      console.error("Error al eliminar corredor:", err);
      alert("Error al eliminar corredor");
    }
  }

  const handleViewVueltas = async (id) => {
    // Si las vueltas ya están visibles y es el mismo corredor, las ocultamos
    if (viewVuelta && vueltas.length > 0 && vueltas[0].runner_id === id) {
      setViewVuelta(false);
      setVueltas([]);
      return;
    }

    // De lo contrario, cargamos las vueltas
    setViewVuelta(false);
    setVueltas([]);
    try {
      const data = await runnerService.getVueltas(id);
      if (data && data.vueltas) {
        setVueltas(data.vueltas);
        setViewVuelta(true);
      } else {
        throw new Error("Formato de datos incorrecto");
      }
    } catch (err) {
      console.error("Error al cargar vueltas:", err);
    }
  };

  const handleDeleteLap = async (id) => {
    const idTiempo = id;
    try {
      if (!window.confirm("¿Estás seguro de que quieres eliminar esta vuelta?")) {
        return;
      }
      await runnerService.deleteVuelta(idTiempo);
      setVueltas(vueltas.filter((vuelta) => vuelta.id !== idTiempo));
    }
    catch (err) {
      console.error("Error al eliminar vuelta:", err);
      alert("Error al eliminar vuelta");
    }
  }

  if (loading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-8 px-1 pb-20 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Eliminar corredor</h2>
      {corredores.map((corredor) => (
        <div className="w-full max-w-md flex flex-col justify-between items-center gap-2 bg-green-500 p-2 rounded-md" key={corredor.user_id}>
          <div className="w-full max-w-md flex justify-between items-center gap-2">
            <img
              src={`${REACT_APP_API_URL}${corredor.foto_perfil}`}
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <h3 className="text-lg w-1/3 font-bold text-left grow">
              {corredor.nombre.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
            </h3>
            <div className="w-2/12 flex flex-col items-center gap-2">
              <button
                onClick={() => handleDelete(corredor.user_id)}
                value={corredor.user_id}
                className="bg-red-500 text-white rounded-md px-2 py-1"
              >
                Eliminar
              </button>
              <button
                onClick={() => handleViewVueltas(corredor.runner_id)}
                value={corredor.runner_id}
                className="bg-red-500 text-white rounded-md px-2 py-1"
              >
                Vueltas
              </button>
            </div>
          </div>
          {viewVuelta && vueltas.map((vuelta) => (
            corredor.runner_id === vuelta.runner_id && (
              <div className="w-full flex flex-col items-center justify-between p-2" key={vuelta.id}>
                <div className="w-full flex items-center justify-between p-2">
                  <p>Vuelta: {vuelta.vuelta}</p>
                  <p>{vuelta.tiempo}</p>
                  <button
                    className="bg-red-500 text-white rounded-md p-2"
                    onClick={() => handleDeleteLap(vuelta.id)}
                  >
                    Eliminar
                  </button>
                </div>
                <hr className="w-full" />
              </div>
            )
          ))}
        </div>
      ))}
    </div>
  );
}

export default DeleteUser;
