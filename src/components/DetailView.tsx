import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pokemon } from "../types/pokemon";
import { PokemonService } from "../services/pokemonService";
import "./DetailView.css";

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<
    "front" | "back" | "shiny_front" | "shiny_back"
  >("front");

  useEffect(() => {
    const loadPokemon = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const pokemonData = await PokemonService.getPokemonById(parseInt(id));
        setPokemon(pokemonData);
      } catch (err) {
        setError("Failed to load Pokemon details");
        console.error("Error loading Pokemon:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [id]);

  const navigateToPokemon = (direction: "prev" | "next") => {
    if (!pokemon) return;

    const newId = direction === "next" ? pokemon.id + 1 : pokemon.id - 1;
    if (newId > 0) {
      navigate(`/pokemon/${newId}`);
    }
  };

  const getCurrentImage = () => {
    if (!pokemon) return "";

    switch (currentImage) {
      case "front":
        return pokemon.sprites.front_default;
      case "back":
        return pokemon.sprites.back_default;
      case "shiny_front":
        return pokemon.sprites.front_shiny;
      case "shiny_back":
        return pokemon.sprites.back_shiny;
      default:
        return pokemon.sprites.front_default;
    }
  };

  const getStatName = (statName: string) => {
    const statMap: { [key: string]: string } = {
      hp: "HP",
      attack: "Attack",
      defense: "Defense",
      "special-attack": "Sp. Attack",
      "special-defense": "Sp. Defense",
      speed: "Speed",
    };
    return statMap[statName] || statName;
  };

  if (loading) {
    return (
      <div className="detail-view">
        <div className="loading">Loading Pokemon details...</div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="detail-view">
        <div className="error">
          <h2>Pokemon not found</h2>
          <p>{error || "The Pokemon you're looking for doesn't exist."}</p>
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-view">
      <div className="detail-header">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
        <div className="navigation-controls">
          <button
            onClick={() => navigateToPokemon("prev")}
            disabled={pokemon.id <= 1}
            className="nav-button prev"
          >
            ← Previous
          </button>
          <button
            onClick={() => navigateToPokemon("next")}
            className="nav-button next"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="pokemon-detail">
        <div className="pokemon-image-section">
          <div className="image-container">
            <img
              src={getCurrentImage()}
              alt={pokemon.name}
              className="pokemon-image"
            />
          </div>

          <div className="image-controls">
            <button
              onClick={() => setCurrentImage("front")}
              className={`image-btn ${
                currentImage === "front" ? "active" : ""
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setCurrentImage("back")}
              className={`image-btn ${currentImage === "back" ? "active" : ""}`}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentImage("shiny_front")}
              className={`image-btn ${
                currentImage === "shiny_front" ? "active" : ""
              }`}
            >
              Shiny Front
            </button>
            <button
              onClick={() => setCurrentImage("shiny_back")}
              className={`image-btn ${
                currentImage === "shiny_back" ? "active" : ""
              }`}
            >
              Shiny Back
            </button>
          </div>
        </div>

        <div className="pokemon-info">
          <div className="pokemon-header">
            <h1 className="pokemon-name">{pokemon.name}</h1>
            <span className="pokemon-id">#{pokemon.id}</span>
          </div>

          <div className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <span key={index} className={`type-badge type-${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>

          <div className="pokemon-stats">
            <h3>Base Stats</h3>
            <div className="stats-grid">
              {pokemon.stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-name">
                    {getStatName(stat.stat.name)}
                  </span>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pokemon-details">
            <div className="detail-item">
              <span className="detail-label">Height:</span>
              <span className="detail-value">{pokemon.height / 10}m</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Weight:</span>
              <span className="detail-value">{pokemon.weight / 10}kg</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Base Experience:</span>
              <span className="detail-value">{pokemon.base_experience}</span>
            </div>
          </div>

          <div className="pokemon-abilities">
            <h3>Abilities</h3>
            <div className="abilities-list">
              {pokemon.abilities.map((ability, index) => (
                <div key={index} className="ability-item">
                  <span className="ability-name">{ability.ability.name}</span>
                  {ability.is_hidden && (
                    <span className="hidden-badge">Hidden</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pokemon-moves">
            <h3>Moves ({pokemon.moves.length})</h3>
            <div className="moves-list">
              {pokemon.moves.slice(0, 20).map((move, index) => (
                <span key={index} className="move-item">
                  {move.move.name}
                </span>
              ))}
              {pokemon.moves.length > 20 && (
                <span className="more-moves">
                  +{pokemon.moves.length - 20} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
