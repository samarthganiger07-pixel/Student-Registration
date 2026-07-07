import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/hotels";

function App() {

  const [hotels, setHotels] = useState([]);

  const [form, setForm] = useState({
    hotel_name: "",
    manager_name: "",
    location: "",
    rooms: "",
    available_rooms: "",
    price: ""
  });

  const [editId, setEditId] = useState(null);

  const loadHotels = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setHotels(data);
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveHotel = async () => {

    if (editId) {

      await fetch(API + "/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

    } else {

      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

    }

    setForm({
      hotel_name: "",
      manager_name: "",
      location: "",
      rooms: "",
      available_rooms: "",
      price: ""
    });

    setEditId(null);
    loadHotels();
  };

  const editHotel = (hotel) => {
    setForm(hotel);
    setEditId(hotel.id);
  };

  const deleteHotel = async (id) => {

    await fetch(API + "/" + id, {
      method: "DELETE"
    });

    loadHotels();

  };

  return (

    <div className="container">

      <h1>Hotel Manager System</h1>

      <input
        placeholder="Hotel Name"
        name="hotel_name"
        value={form.hotel_name}
        onChange={change}
      />

      <input
        placeholder="Manager Name"
        name="manager_name"
        value={form.manager_name}
        onChange={change}
      />

      <input
        placeholder="Location"
        name="location"
        value={form.location}
        onChange={change}
      />

      <input
        placeholder="Total Rooms"
        name="rooms"
        value={form.rooms}
        onChange={change}
      />

      <input
        placeholder="Available Rooms"
        name="available_rooms"
        value={form.available_rooms}
        onChange={change}
      />

      <input
        placeholder="Price"
        name="price"
        value={form.price}
        onChange={change}
      />

      <button onClick={saveHotel}>
        {editId ? "Update Hotel" : "Add Hotel"}
      </button>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Hotel</th>
            <th>Manager</th>
            <th>Location</th>
            <th>Rooms</th>
            <th>Available</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {hotels.map((hotel) => (

            <tr key={hotel.id}>

              <td>{hotel.id}</td>
              <td>{hotel.hotel_name}</td>
              <td>{hotel.manager_name}</td>
              <td>{hotel.location}</td>
              <td>{hotel.rooms}</td>
              <td>{hotel.available_rooms}</td>
              <td>₹{hotel.price}</td>

              <td>

                <button onClick={() => editHotel(hotel)}>
                  Edit
                </button>

                <button onClick={() => deleteHotel(hotel.id)}>
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default App;