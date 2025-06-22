import React from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftComponent,
  rightComponent,
  backgroundColor = "#ffffff",
  titleColor = "#000000",
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        },
        style,
      ]}
    >
      <View style={{ flex: 1, alignItems: "flex-start" }}>{leftComponent}</View>

      <View style={{ flex: 2, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: titleColor,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: "flex-end" }}>{rightComponent}</View>
    </View>
  );
};

export default Header;
