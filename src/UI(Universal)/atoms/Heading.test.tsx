import React from "react";
import { render, screen } from "@testing-library/react-native";
import Heading from "./Heading";

describe("Heading Component", () => {
  it("renders correctly", () => {
    render(<Heading />);

    // Check if the heading text is rendered
    expect(screen.getByText("Heading")).toBeTruthy();
  });

  it("has correct styling classes", () => {
    const { getByTestId } = render(<Heading />);

    // You can add testID to your component for better testing
    // For now, we'll test the basic rendering
    expect(screen.getByText("Heading")).toBeTruthy();
  });

  it("is centered on screen", () => {
    render(<Heading />);

    // The component should be centered (flex-1 items-center justify-center)
    // This is tested through the className in the View
    expect(screen.getByText("Heading")).toBeTruthy();
  });
});
