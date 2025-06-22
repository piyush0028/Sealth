import React from "react";
import { Platform, StatusBar, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "light-content" | "dark-content" | "default";
  statusBarHidden?: boolean;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor = "#ffffff",
  statusBarStyle = "dark-content",
  statusBarHidden = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar
        barStyle={statusBarStyle}
        hidden={statusBarHidden}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === "android"}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor,
          // Add padding for Android status bar if translucent
          paddingTop:
            Platform.OS === "android" && !statusBarHidden
              ? StatusBar.currentHeight
              : 0,
        }}
        edges={["top", "left", "right", "bottom"]}
      >
        {children}
      </SafeAreaView>
    </View>
  );
};

export default SafeAreaWrapper;
