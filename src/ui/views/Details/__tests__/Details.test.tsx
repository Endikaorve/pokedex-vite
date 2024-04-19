import { screen } from "@testing-library/react";
import { Details } from "../Details";
import { describe, expect, it } from "vitest";
import { mockUrlParams, render, serviceMockBuilder } from "@/test/utils";
import { pokemonService } from "@/core/Pokemon/services/Pokemon.service";

describe("Details", () => {
  it("should display name of the pokemon", async () => {
    mockUrlParams({ id: "25" });
    serviceMockBuilder(pokemonService, "getById")
      .withValue({
        id: "25",
        name: "Pikachu",
        height: 0.4,
        weight: 6,
        types: ["electric"],
        images: {
          main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
          alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg",
        },
        stats: {
          hp: 35,
          attack: 55,
          defense: 40,
          specialAttack: 50,
          specialDefense: 56,
          speed: 90,
        },
        isFavorite: false,
      })
      .build();

    render(<Details />);

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument();
  });
});
