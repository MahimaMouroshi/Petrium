import React, { useState, useEffect, useContext } from 'react';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { UserContext } from '../../context/UserContext';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const UserProfileForm = () => {
    const { user, profile, products, loading, db, appId } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        phone: '',
        email: '',
        profilePicUrl: 'https://placehold.co/150x150/E2E8F0/1A202C?text=P',
        isSeller: false,
    });
    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        const userId = user?.uid;
        const userProfileRef = doc(db, 'artifacts', appId, 'users', userId, 'profiles', 'userProfile');
        
        try {
            await setDoc(userProfileRef, formData, { merge: true });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
    }
    
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
                    .font-inter { font-family: 'Inter', sans-serif; }
                    .toggle {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                        width: 48px;
                        height: 24px;
                        background-color: #4B5563; /* Gray-600 */
                        border-radius: 9999px;
                        position: relative;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    .toggle:before {
                        content: '';
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        width: 20px;
                        height: 20px;
                        background-color: #9CA3AF; /* Gray-400 */
                        border-radius: 9999px;
                        transition: transform 0.3s, background-color 0.3s;
                    }
                    .toggle:checked {
                        background-color: #6366F1; /* Indigo-500 */
                    }
                    .toggle:checked:before {
                        transform: translateX(24px);
                        background-color: #E0E7FF; /* Indigo-100 */
                    }
                `}
            </style>
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-xl p-8">
                <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">User Profile</h1>
                <p className="text-sm text-gray-400 text-center mb-6">User ID: {user?.uid}</p>
            
                {!isEditing ? (
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        <div className="flex-shrink-0">
                            <img src={profile?.profilePicUrl} alt="Profile" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/E2E8F0/1A202C?text=P" }} className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500" />
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-3xl font-semibold mb-2">{profile?.name || 'New User'}</h2>
                            <p className="text-gray-400">
                                {profile?.location && <span>Location: {profile.location}</span>}
                            </p>
                            <p className="text-gray-400">
                                {profile?.phone && <span>Phone: {profile.phone}</span>}
                            </p>
                            <p className="text-gray-400">
                                {profile?.email && <span>Email: {profile.email}</span>}
                            </p>
                            <p className="text-lg mt-4 flex items-center justify-center md:justify-start">
                                <span className="font-medium mr-2">Status:</span>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${profile?.isSeller ? 'bg-green-500 text-green-900' : 'bg-blue-500 text-blue-900'}`}>
                                    {profile?.isSeller ? 'Seller' : 'Regular User'}
                                </span>
                            </p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                ) : (
                
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <img src={formData.profilePicUrl} alt="Profile" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/E2E8F0/1A202C?text=P" }} className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500" />
                            <label className="block w-full">
                                <span className="text-gray-400">Profile Picture URL</span>
                                <input
                                    type="text"
                                    name="profilePicUrl"
                                    value={formData.profilePicUrl}
                                    onChange={handleFormChange}
                                    placeholder="e.g., https://example.com/pic.jpg"
                                    className="mt-1 block w-full px-4 py-2 bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block">
                                    <span className="text-gray-400">Full Name</span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required={formData.isSeller}
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block">
                                    <span className="text-gray-400">Location</span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleFormChange}
                                        required={formData.isSeller}
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block">
                                    <span className="text-gray-400">Phone</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        required={formData.isSeller}
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block">
                                    <span className="text-gray-400">Email</span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        required={formData.isSeller}
                                        className="mt-1 block w-full px-4 py-2 bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="isSeller" className="text-xl font-medium">Switch to Seller Profile</label>
                            <input
                                type="checkbox"
                                id="isSeller"
                                name="isSeller"
                                checked={formData.isSeller}
                                onChange={handleFormChange}
                                className="toggle toggle-indigo-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 border border-gray-600 text-gray-300 font-bold rounded-full hover:bg-gray-700 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}

                {profile?.isSeller && !isEditing && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-4 text-center text-indigo-400">Seller Dashboard</h2>
                        <ProductForm />
                        <h3 className="text-xl font-semibold mb-4">Your Products</h3>
                        <ProductList />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileForm;