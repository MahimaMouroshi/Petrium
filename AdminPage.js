import React, { useState } from "react";
import PetList from "../components/PetList";
import PetForm from "../components/PetForm";

export default function AdminPage() {
  const [editingPet, setEditingPet] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const onEdit = (pet) => {
    setEditingPet(pet);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSuccess = () => {
    setEditingPet(null);
    setRefreshToggle(!refreshToggle); 
  };

  const onCancel = () => {
    setEditingPet(null);
  };

  return (
    <div className="admin-page">
      <PetForm petToEdit={editingPet} onSuccess={onSuccess} onCancel={onCancel} />
      <PetList key={refreshToggle} onEdit={onEdit} />
    </div>
  );
}
