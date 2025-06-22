import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react-native";

// Override render method
export { customRender as render };
