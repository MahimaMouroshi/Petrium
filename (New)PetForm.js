import React from "react";
import "./PetCard.css";

function PetCard({ pet, onAdopt, onDelete, isAdmin }) {
  const isImage = (url) => /\.(jpeg|jpg|png|gif|webp|bmp)$/i.test(url);

  return (
    <div className="pet-card">
      <img
        src={pet.image ? `http://localhost:5000${pet.image}` : "https://via.placeholder.com/150?text=No+Image"}
        alt={pet.name}
        width="100"
        height="100"
        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
      />
      <h3>{pet.name}</h3>
      <p><strong>Genre:</strong> {pet.genre}</p>
      <p><strong>Age:</strong> {pet.age}</p>
      <p><strong>Gender:</strong> {pet.gender}</p>
      <p><strong>Price:</strong> ৳{pet.price}</p>
      <p><strong>Details:</strong> {pet.description}</p>

      <button onClick={() => onAdopt(pet)}>Adopt Me</button>
      {isAdmin && <button onClick={() => onDelete(pet._id)}>Delete</button>}
    </div>
  );
}

export default React.memo(PetCard);
