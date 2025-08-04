import React, { useState, useRef } from "react";
import axios from "axios";

const PetForm = ({ onPetAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    age: "",
    gender: "",
    price: "",
    foodHabit: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const dropRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    setImageFile(file);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e) => {
    handleImageChange(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      data.append("image", imageFile);

      const res = await axios.post("http://localhost:5000/api/admin/pets", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPetAdded(res.data);
      setFormData({
        name: "",
        genre: "",
        age: "",
        gender: "",
        price: "",
        foodHabit: "",
        description: "",
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      alert("Error uploading pet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pet-form">
      <input type="text" name="name" placeholder="Pet Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} required />
      <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
      <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
      <input type="text" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <input type="text" name="foodHabit" placeholder="Food Habit" value={formData.foodHabit} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{
          border: "2px dashed #ccc",
          borderRadius: "5px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "10px",
          cursor: "pointer",
          color: "#999",
        }}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", maxHeight: "200px" }} />
        ) : (
          "Drag & drop an image here, or click to select"
        )}
      </div>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileInputChange}
      />

      <button type="submit">Add Pet</button>
    </form>
  );
};

export default PetForm;
