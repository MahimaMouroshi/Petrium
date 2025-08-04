import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import "./UserProfile.css";
import PetForm from "../components/PetForm";

export default function UserProfile() {
  const { user, loginUser, logoutUser } = useContext(UserContext);
  const [showSellForm, setShowSellForm] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    role: user?.role || "buyer",
    profilePic: user?.profilePic || null,
  });

  const [previewImage, setPreviewImage] = useState(user?.profilePic || null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        role: user.role || "buyer",
        profilePic: user.profilePic || null,
      });
      setPreviewImage(user.profilePic || null);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="user-profile-container">
        <h2>Please log in to view your profile.</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, profilePic: imageUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    loginUser({ ...user, ...formData });
    alert("Profile saved!");
  };

  const handleRoleToggle = () => {
    const newRole = formData.role === "buyer" ? "seller" : "buyer";
    setFormData((prev) => ({ ...prev, role: newRole }));
    loginUser({ ...user, role: newRole });
  };

  const handleSellPetSubmit = (petData) => {
    const existingRequests = JSON.parse(localStorage.getItem("pendingSellRequests")) || [];
    const newRequest = {
      ...petData,
      seller: formData.name,
      approved: false,
      id: Date.now(),
    };
    existingRequests.push(newRequest);
    localStorage.setItem("pendingSellRequests", JSON.stringify(existingRequests));
    alert("Pet sell request sent to admin for approval!");
    setShowSellForm(false);
  };

  return (
    <div className="user-profile-container">
      <h2>👤 Welcome, {formData.name}</h2>

      <div className="profile-section">
        <div className="profile-img-container">
          <img
            src={previewImage || "https://via.placeholder.com/120"}
            alt="Profile"
            className="profile-pic"
          />
          <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
        </div>

        <div className="info-form">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} disabled />

          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

          <label>Bio:</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />

          <label>Role: {formData.role.toUpperCase()}</label>
          <button className="role-toggle" onClick={handleRoleToggle}>
            Toggle Role
          </button>

          {formData.role === "seller" && (
            <>
              {!showSellForm && (
                <button className="sell-request-btn" onClick={() => setShowSellForm(true)}>
                  🐶 Sell a Pet (Request Approval)
                </button>
              )}
              {showSellForm && (
                <PetForm onSubmit={handleSellPetSubmit} isSellerRequest={true} />
              )}
            </>
          )}

          <button className="save-btn" onClick={handleSave}>
            💾 Save Profile
          </button>

          <button className="logout-button" onClick={logoutUser}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
