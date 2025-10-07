import axios from "axios";
import { Pokemon, PokemonListResponse, PokemonTypesResponse } from "../types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

// Create axios instance with default config
const pokemonAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class PokemonService {
  static async getAllPokemon(limit: number = 1000, offset: number = 0): Promise<PokemonListResponse> {
    try {
      const response = await pokemonAPI.get(`/pokemon?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokemon list:", error);
      throw new Error("Failed to fetch Pokemon list");
    }
  }

  static async getPokemonById(id: number): Promise<Pokemon> {
    try {
      const response = await pokemonAPI.get(`/pokemon/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Pokemon with id ${id}:`, error);
      throw new Error(`Failed to fetch Pokemon with id ${id}`);
    }
  }

  static async getPokemonByName(name: string): Promise<Pokemon> {
    try {
      const response = await pokemonAPI.get(`/pokemon/${name.toLowerCase()}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Pokemon with name ${name}:`, error);
      throw new Error(`Failed to fetch Pokemon with name ${name}`);
    }
  }

  static async getPokemonTypes(): Promise<PokemonTypesResponse> {
    try {
      const response = await pokemonAPI.get("/type");
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokemon types:", error);
      throw new Error("Failed to fetch Pokemon types");
    }
  }

  static async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      // First try to get all Pokemon and filter client-side
      const allPokemon = await this.getAllPokemon(1000, 0);
      const pokemonPromises = allPokemon.results
        .filter((pokemon) => pokemon.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 20) // Limit to 20 results for performance
        .map((pokemon) => this.getPokemonByName(pokemon.name));

      return Promise.all(pokemonPromises);
    } catch (error) {
      console.error("Error searching Pokemon:", error);
      return [];
    }
  }
}
