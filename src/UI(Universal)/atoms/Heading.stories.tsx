import React from "react";
import { View } from "react-native";
import Heading from "./Heading";

export default {
  title: "Atoms/Heading",
  component: Heading,
  parameters: {
    notes:
      "This is a centered heading component used in the UP heading design from Figma.",
  },
};

// Default story
export const Default = () => (
  <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
    <Heading />
  </View>
);

// Story with dark background
export const OnDarkBackground = () => (
  <View style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
    <Heading />
  </View>
);

// Story showing the component in a container
export const InContainer = () => (
  <View style={{ flex: 1, padding: 20, backgroundColor: "#ffffff" }}>
    <View
      style={{
        height: 200,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
      }}
    >
      <Heading />
    </View>
  </View>
);
