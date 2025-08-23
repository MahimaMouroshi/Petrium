import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [petForm, setPetForm] = useState({
    name: "",
    type: "",
    price: "",
    gender: "",
    foodHabit: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [sellRequests, setSellRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPets();
    fetchAdoptionRequests();
    fetchSellRequests();
  }, []);

  
  const fetchPets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pets");
      setPets(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdoptionRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/adoptions");
      setAdoptionRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSellRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/sell-requests");
      setSellRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };


  const handlePetFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setPetForm({ ...petForm, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setPetForm({ ...petForm, [name]: value });
    }
  };


  const handleAddPet = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!petForm.name || !petForm.type || !petForm.price) {
      setErrorMessage("Name, Type, and Price are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", petForm.name);
      formData.append("type", petForm.type);
      formData.append("price", petForm.price);
      if (petForm.gender) formData.append("gender", petForm.gender);
      if (petForm.foodHabit) formData.append("foodHabit", petForm.foodHabit);
      if (petForm.description) formData.append("description", petForm.description);
      if (petForm.image) formData.append("image", petForm.image); // key MUST match multer

      const res = await axios.post("http://localhost:5000/api/admin/pets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "Pet added successfully!");
      setPetForm({ name: "", type: "", price: "", gender: "", foodHabit: "", description: "", image: null });
      setImagePreview(null);
      fetchPets();
    } catch (err) {
      console.error(err.response?.data || err);
      setErrorMessage(err.response?.data?.message || "Failed to add pet.");
    }
  };


  const handleDeletePet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/pets/${id}`);
      fetchPets();
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>🐾 Petrium Admin Dashboard</h1>

      <section className="admin-section">
        <h2>Add New Pet</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="pet-form" onSubmit={handleAddPet}>
          <input type="text" name="name" value={petForm.name} onChange={handlePetFormChange} placeholder="Pet Name *" required />
          <input type="text" name="type" value={petForm.type} onChange={handlePetFormChange} placeholder="Pet Type *" required />
          <input type="number" name="price" value={petForm.price} onChange={handlePetFormChange} placeholder="Price *" required />
          <input type="text" name="gender" value={petForm.gender} onChange={handlePetFormChange} placeholder="Gender" />
          <input type="text" name="foodHabit" value={petForm.foodHabit} onChange={handlePetFormChange} placeholder="Food Habit" />
          <textarea name="description" value={petForm.description} onChange={handlePetFormChange} placeholder="Description"></textarea>
          <input type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handlePetFormChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
          <button type="submit" className="btn-primary">Add Pet</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Stored Pets</h2>
        <div className="pet-list">
          {pets.length > 0 ? pets.map(pet => (
            <div className="pet-card-admin" key={pet._id}>
              {pet.image && <img src={`http://localhost:5000${pet.image}`} alt={pet.name} />}
              <h3>{pet.name}</h3>
              <p>Type: {pet.type}</p>
              <p>Price: ৳{pet.price}</p>
              <button className="btn-danger" onClick={() => handleDeletePet(pet._id)}>Delete</button>
            </div>
          )) : <p>No pets found.</p>}
        </div>
      </section>

      <section className="admin-section">
        <h2>Buyer (Adoption) Requests</h2>
        <ul className="request-list">
          {adoptionRequests.length > 0 ? adoptionRequests.map(req => (
            <li key={req._id}><strong>{req.buyerName}</strong> wants to adopt <em>{req.petName}</em></li>
          )) : <p>No adoption requests found.</p>}
        </ul>
      </section>

      <section className="admin-section">
        <h2>Seller Requests</h2>
        <ul className="request-list">
          {sellRequests.length > 0 ? sellRequests.map(req => (
            <li key={req._id}><strong>{req.sellerName}</strong> wants to sell <em>{req.petName}</em></li>
          )) : <p>No seller requests found.</p>}
        </ul>
      </section>
    </div>
  );

}

export default AdminDashboard;

