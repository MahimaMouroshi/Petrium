import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import PetCard from "./PetCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PetList.css";

function PetList({ filterGenre = null }) {
  const [pets, setPets] = useState([]);
  const [localFilter, setLocalFilter] = useState(filterGenre);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pets");
        let allPets = res.data;

        if (localFilter) {
          allPets = allPets.filter(
            (p) => p.genre.toLowerCase() === localFilter.toLowerCase()
          );
        }

        setPets(allPets);
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
    };

    fetchPets();
  }, [localFilter]);
  const handleAdopt = (pet) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item._id === pet._id);
    if (!exists) {
      cart.push(pet);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${pet.name} added to your cart!`);
    } else {
      alert(`${pet.name} is already in your cart.`);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="pet-list-container">
      {/* Filter Buttons */}
      <div className="filter-buttons" style={{ marginBottom: "1rem", textAlign: "center" }}>
        <button onClick={() => setLocalFilter(null)}>All Pets</button>
        <button onClick={() => setLocalFilter("Dog")}>Dogs</button>
        <button onClick={() => setLocalFilter("Cat")}>Cats</button>
        <button onClick={() => setLocalFilter("Bird")}>Birds</button>
        <button onClick={() => setLocalFilter("Fish")}>Fishes</button>
        <button onClick={() => setLocalFilter("Turtle")}>Turtles</button>
        <button onClick={() => setLocalFilter("Axolotl")}>Axolotls</button>
        <button onClick={() => setLocalFilter("Other")}>Others</button>
      </div>

      {/* Slider with pets */}
      <Slider {...settings}>
        {pets.map((pet) => (
          <div key={pet._id}>
            <PetCard pet={pet} onAdopt={handleAdopt} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default PetList;
