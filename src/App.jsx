import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"
import "leaflet/dist/leaflet.css";


function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [coords, setCoords] = useState(0);

  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((res) => res.json())
      .then((data) => {
        setData(data.provincias);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);


  const customIcon = new L.Icon({
    iconUrl: "/iconmonstr-flag-18.svg", // Ruta a tu archivo SVG
    iconSize: [32, 32], // Tamaño del icono (ajusta si es necesario)
    iconAnchor: [16, 32], // Punto de anclaje del icono
    popupAnchor: [0, -32], // Punto de anclaje para el popup
  });

  function handleSelect(event) {
    const selectedProvinceIndex = event.target.selectedIndex;
    setCoords(selectedProvinceIndex);
  }
  return (
    <div className="flex flex-col h-screen bg-gray-500 text-white w-full ">
      <div>
        <h1 className="text-center text-[2rem]">Provincias de Argentina</h1>
        <div>
        </div>
        {loading ? (
          <div>Cargando provincias</div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <select
              className="text-black max-w-[300px]"
              onChange={handleSelect}
            >
              {data.map((data, index) => (
                <option key={index}>{data.nombre}</option>
              ))}
            </select>
            <h2 className="text-center mt-6 underline">Coordenadas</h2>
            <div className="flex flex-col">
              <span className="text-center">
                Lat: {data[coords].centroide.lat}
              </span>
              <span className="text-center">
                Lon: {data[coords].centroide.lon}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-9 ">
        {loading ? (
          <div>Cargando mapa...</div>
        ) : (
          <MapContainer center={[-40, -65]} zoom={4} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                data[coords].centroide.lat,
                data[coords].centroide.lon,
              ]}
              icon={customIcon}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default App;
