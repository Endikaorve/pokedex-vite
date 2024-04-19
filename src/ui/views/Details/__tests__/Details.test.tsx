import { screen } from "@testing-library/react";
import { Details } from "../Details";
import { describe, expect, it } from "vitest";
import { mockUrlParams, render, serviceMockBuilder } from "@/test/utils";
import { pokemonService } from "@/core/Pokemon/services/Pokemon.service";
import { pokemonBuilder } from "@/core/Pokemon/domain/__builders__/Pokemon.builder";

describe("Details", () => {
  it("should display name of the pokemon", async () => {
    mockUrlParams({ id: "25" });
    serviceMockBuilder(pokemonService, "getById")
      .withValue(
        pokemonBuilder({
          name: "Pikachu",
        }).build()
      )
      .build();

    render(<Details />);

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument();
  });
});
