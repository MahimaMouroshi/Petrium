import React from "react";
import "./PetCard.css";

function PetCard({ pet, onAdopt }) {
  const imageSrc = pet.image
    ? `http://localhost:5000${pet.image}`
    : "https://via.placeholder.com/150?text=No+Image";

  return (
    <div className="pet-card">
      <img
        src={imageSrc}
        alt={pet.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150?text=No+Image";
        }}
      />
      <h3>{pet.name}</h3>
      <p><strong>Type:</strong> {pet.type}</p>
      <p><strong>Price:</strong> ৳{pet.price}</p>
      <p><strong>Gender:</strong> {pet.gender || "-"}</p>
      <p><strong>Food Habit:</strong> {pet.foodHabit || "-"}</p>
      <p><strong>Description:</strong> {pet.description || "-"}</p>
      <button onClick={() => onAdopt(pet)}>Adopt Me</button>
    </div>
  );
}

export default React.memo(PetCard);
