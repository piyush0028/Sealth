import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useSafeArea = () => {
  const insets = useSafeAreaInsets();

  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    // Helper methods
    getPaddingTop: (additionalPadding = 0) => insets.top + additionalPadding,
    getPaddingBottom: (additionalPadding = 0) =>
      insets.bottom + additionalPadding,
    getPaddingHorizontal: (additionalPadding = 0) => ({
      paddingLeft: insets.left + additionalPadding,
      paddingRight: insets.right + additionalPadding,
    }),
    getPaddingVertical: (additionalPadding = 0) => ({
      paddingTop: insets.top + additionalPadding,
      paddingBottom: insets.bottom + additionalPadding,
    }),
    // Full padding object
    getFullPadding: (additionalPadding = 0) => ({
      paddingTop: insets.top + additionalPadding,
      paddingBottom: insets.bottom + additionalPadding,
      paddingLeft: insets.left + additionalPadding,
      paddingRight: insets.right + additionalPadding,
    }),
  };
};
