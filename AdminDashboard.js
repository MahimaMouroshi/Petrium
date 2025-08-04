import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    age: "",
    gender: "",
    price: "",
    foodHabit: "",
    description: "",
    image: "",
  });

  const [stats, setStats] = useState({ totalUsers: 0, dailyUsers: 0 });
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchPets();
    fetchStats();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pets");
      setPets(res.data);
    } catch (err) {
      console.error("Failed to fetch pets", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/upload", formDataImg);
      const uploadedPath = res.data.filePath;

      setImageUrl(uploadedPath);
      setFormData((prev) => ({ ...prev, image: uploadedPath }));
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    const fields = [
      "name", "genre", "age", "gender", "price", "foodHabit", "description", "image"
    ];
    for (let field of fields) {
      if (!formData[field]) {
        alert(`Please fill in ${field}`);
        return;
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/admin/pets", formData);
      setPets((prev) => [...prev, res.data]);

      // Reset form
      setFormData({
        name: "",
        genre: "",
        age: "",
        gender: "",
        price: "",
        foodHabit: "",
        description: "",
        image: "",
      });
      setImageUrl("");
    } catch (err) {
      console.error("Failed to add pet", err);
      alert("Pet could not be added.");
    }
  };

  const handleDeletePet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/pets/${id}`);
      setPets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete pet", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>🐾 Admin Dashboard</h1>

      <div className="stats">
        <h3>📊 User Statistics</h3>
        <p>Total Registered Users: {stats.totalUsers}</p>
        <p>Today's Registrations: {stats.dailyUsers}</p>
      </div>

      <div className="add-pet-form">
        <h3>➕ Add New Pet</h3>
        <form onSubmit={handleAddPet}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleInput} required />
          <input name="genre" placeholder="Genre (e.g., Dog, Cat)" value={formData.genre} onChange={handleInput} required />
          <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleInput} required />
          <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleInput} required />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleInput} required />
          <input name="foodHabit" placeholder="Food Habit" value={formData.foodHabit} onChange={handleInput} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInput} required />

          <input type="file" accept="image/*" onChange={handleImageChange} />
          {uploading && <p>Uploading...</p>}
          {imageUrl && (
            <img
              src={`http://localhost:5000${imageUrl}`}
              alt="Preview"
              width="100"
              height="100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
              }}
            />
          )}

          <button type="submit">Add Pet</button>
        </form>
      </div>

      <div className="pet-list">
        <h3>🐶 All Pets</h3>
        {pets.length === 0 ? (
          <p>No pets added yet.</p>
        ) : (
          <div className="pet-list-container">
            {pets.map((pet) => (
              <div className="pet-item" key={pet._id}>
                <img
                  src={`http://localhost:5000${pet.image}`}
                  alt={pet.name}
                  width="100"
                  height="100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                  }}
                />
                <div>
                  <strong>{pet.name}</strong> ({pet.genre})<br />
                  Age: {pet.age}, Gender: {pet.gender}, ৳{pet.price}<br />
                  Food: {pet.foodHabit}<br />
                  <small>{pet.description}</small>
                </div>
                <button onClick={() => handleDeletePet(pet._id)}>❌ Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
