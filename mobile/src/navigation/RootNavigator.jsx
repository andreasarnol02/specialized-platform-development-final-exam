import React from "react";
import { StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from "../theme";
import { Spinner } from "../components/states";
import { useAuth } from "../context/AuthContext";
import MainNavigator from "./MainNavigator";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Auth-gated root: no token -> Login/Register stack; token -> main app.
// Session is restored from SecureStore on launch (AuthProvider boot).
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token, booting } = useAuth();

  if (booting) {
    return (
      <View style={styles.splash}>
        <Spinner label="Memuat..." />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={token ? "Main" : "Login"}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      {token ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
