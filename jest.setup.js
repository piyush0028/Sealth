import "@testing-library/jest-native/extend-expect";

// Mock NativeWind
jest.mock("nativewind", () => ({
  styled: {
    View: "View",
    Text: "Text",
    TouchableOpacity: "TouchableOpacity",
  },
  useColorScheme: () => "light",
}));

// Mock expo
jest.mock("expo", () => ({
  StatusBar: {
    setBarStyle: jest.fn(),
  },
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Global test setup
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
