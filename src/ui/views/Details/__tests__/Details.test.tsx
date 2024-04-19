import { screen } from "@testing-library/react";
import { Details } from "../Details";
import { describe, expect, it, vitest } from "vitest";
import { mockUrlParams, render, serviceMockBuilder } from "@/test/utils";
import * as pokemonServiceContainer from "@/core/Pokemon/services/_di/Pokemon.service.container";
import { pokemonService } from "@/core/Pokemon/services/Pokemon.service";

describe("Details", () => {
  it("should display name of the pokemon", async () => {
    mockUrlParams({ id: "25" });

    // serviceMockBuilder(
    //   pokemonServiceContainer,
    //   ""
    // )
    //   .withValue({
    //     id: "1",
    //     name: "bulbasaur",
    //     height: 0.7,
    //     weight: 6.9,
    //     types: ["grass", "poison"],
    //     images: {
    //       main: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    //       alt: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg",
    //     },
    //     stats: {
    //       hp: 45,
    //       attack: 49,
    //       defense: 49,
    //       specialAttack: 65,
    //       specialDefense: 65,
    //       speed: 45,
    //     },
    //     isFavorite: false,
    //   })
    //   .build();

    render(<Details />);

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument();
  });
});
