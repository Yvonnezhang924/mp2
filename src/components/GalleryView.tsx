import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Pokemon, PokemonType } from "../types/pokemon";
import { PokemonService } from "../services/pokemonService";
import "./GalleryView.css";

const GalleryView: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allPokemon, types] = await Promise.all([
          PokemonService.getAllPokemon(200, 0),
          PokemonService.getPokemonTypes(),
        ]);

        // Get detailed Pokemon data for the first 200 Pokemon
        const pokemonDetails = await Promise.all(
          allPokemon.results.slice(0, 200).map(async (pokemon, index) => {
            try {
              return await PokemonService.getPokemonById(index + 1);
            } catch (error) {
              console.error(`Error loading Pokemon ${index + 1}:`, error);
              return null;
            }
          })
        );

        setPokemonList(pokemonDetails.filter(Boolean) as Pokemon[]);
        setPokemonTypes(types.results);
      } catch (error) {
        console.error("Error loading Pokemon data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPokemon = useMemo(() => {
    if (selectedTypes.length === 0) {
      return pokemonList;
    }

    return pokemonList.filter((pokemon) =>
      pokemon.types.some((type) => selectedTypes.includes(type.type.name))
    );
  }, [pokemonList, selectedTypes]);

  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((type) => type !== typeName)
        : [...prev, typeName]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
  };

  if (loading) {
    return (
      <div className="gallery-view">
        <div className="loading">Loading Pokemon Gallery...</div>
      </div>
    );
  }

  return (
    <div className="gallery-view">
      <div className="gallery-header">
        <h2>Pokemon Gallery</h2>
        <p>Browse Pokemon by type and discover their unique characteristics</p>
      </div>

      <div className="filter-container">
        <div className="filter-section">
          <h3>Filter by Type</h3>
          <div className="type-filters">
            {pokemonTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => handleTypeToggle(type.name)}
                className={`type-filter ${
                  selectedTypes.includes(type.name) ? "active" : ""
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
          {selectedTypes.length > 0 && (
            <button onClick={clearFilters} className="clear-filters">
              Clear Filters ({selectedTypes.length})
            </button>
          )}
        </div>

        <div className="results-info">
          <span>
            Showing {filteredPokemon.length} of {pokemonList.length} Pokemon
            {selectedTypes.length > 0 &&
              ` (filtered by: ${selectedTypes.join(", ")})`}
          </span>
        </div>
      </div>

      <div className="gallery-grid">
        {filteredPokemon.map((pokemon) => (
          <Link
            key={pokemon.id}
            to={`/pokemon/${pokemon.id}`}
            className="gallery-card"
          >
            <div className="card-image-container">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="gallery-image"
              />
              <div className="card-overlay">
                <div className="overlay-content">
                  <h3 className="card-name">{pokemon.name}</h3>
                  <p className="card-id">#{pokemon.id}</p>
                </div>
              </div>
            </div>
            <div className="card-types">
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className={`type-badge type-${type.type.name}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filteredPokemon.length === 0 && selectedTypes.length > 0 && (
        <div className="no-results">
          <h3>No Pokemon found</h3>
          <p>Try selecting different types or clear the filters</p>
          <button onClick={clearFilters} className="clear-filters">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
