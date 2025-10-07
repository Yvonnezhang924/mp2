import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="pokemon-characters">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
              alt="Pikachu"
              className="pokemon-char"
            />
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
              alt="Bulbasaur"
              className="pokemon-char"
            />
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
              alt="Charmander"
              className="pokemon-char"
            />
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
              alt="Squirtle"
              className="pokemon-char"
            />
          </div>
          <span className="logo-text">Gotta Catch 'Em All</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Search
          </Link>
          <Link
            to="/gallery"
            className={`nav-link ${
              location.pathname === "/gallery" ? "active" : ""
            }`}
          >
            Gallery
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
