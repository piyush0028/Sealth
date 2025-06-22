import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Screen from "../../EssentialComponents/Screen";

const SingIn = () => {
  return (
    <Screen scrollable backgroundColor="#ffffff">
      <View className="flex-1 items-center">
        <Text className="text-xl text-orange-900 font-bold">SingIn Page</Text>
      </View>
    </Screen>
  );
};

export default SingIn;