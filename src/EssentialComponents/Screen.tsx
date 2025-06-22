import React from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  padding?: number;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  backgroundColor = '#ffffff',
  padding = 16,
}) => {
  const insets = useSafeAreaInsets();

  const screenStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
    ...style,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    padding,
    ...contentContainerStyle,
  };

  if (scrollable) {
    return (
      <View style={screenStyle}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={screenStyle}>
      <View style={contentStyle}>
        {children}
      </View>
    </View>
  );
};

export default Screen; 