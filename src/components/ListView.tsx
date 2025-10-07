import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Pokemon, SortField, SortOrder } from "../types/pokemon";
import { PokemonService } from "../services/pokemonService";
import "./ListView.css";

const ListView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const searchPokemon = async () => {
      if (searchQuery.trim()) {
        setLoading(true);
        try {
          const results = await PokemonService.searchPokemon(searchQuery);
          setPokemonList(results);
        } catch (error) {
          console.error("Error searching Pokemon:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setPokemonList([]);
      }
    };

    const timeoutId = setTimeout(searchPokemon, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const sortedPokemon = useMemo(() => {
    return [...pokemonList].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "height":
          aValue = a.height;
          bValue = b.height;
          break;
        case "weight":
          aValue = a.weight;
          bValue = b.weight;
          break;
        case "base_experience":
          aValue = a.base_experience;
          bValue = b.base_experience;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [pokemonList, sortField, sortOrder]);

  return (
    <div className="list-view">
      <div className="search-container">
        <h2>Search Pokemon</h2>
        <input
          type="text"
          placeholder="Search Pokemon by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="sort-controls">
          <label>
            Sort by:
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="height">Height</option>
              <option value="weight">Weight</option>
              <option value="base_experience">Base Experience</option>
            </select>
          </label>

          <label>
            Order:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="sort-select"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>

      <div className="results-container">
        {loading && <div className="loading">Searching...</div>}

        {!loading && searchQuery && sortedPokemon.length === 0 && (
          <div className="no-results">
            No Pokemon found matching "{searchQuery}"
          </div>
        )}

        {!loading && sortedPokemon.length > 0 && (
          <div className="pokemon-grid">
            {sortedPokemon.map((pokemon) => (
              <Link
                key={pokemon.id}
                to={`/pokemon/${pokemon.id}`}
                className="pokemon-card"
              >
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <div className="pokemon-info">
                  <h3 className="pokemon-name">{pokemon.name}</h3>
                  <p className="pokemon-id">#{pokemon.id}</p>
                  <div className="pokemon-types">
                    {pokemon.types.map((type, index) => (
                      <span
                        key={index}
                        className={`type-badge type-${type.type.name}`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!searchQuery && (
          <div className="search-prompt">
            Enter a Pokemon name to start searching
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
