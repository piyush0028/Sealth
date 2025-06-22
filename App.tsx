import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SingIn from "./src/Forms/screens/SingIn";
import "./global.css";
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SingIn />
    </SafeAreaProvider>
  );
}
