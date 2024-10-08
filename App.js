import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./app/Home";
import SignIn from "./app/SignIn";
import SignUp from "./app/SignUp";
import ChatList from "./app/ChatList";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import Chat from "./app/Chat";

export default function App() {
  const [loaded, error] = useFonts({
    "TitanOne-Regular": require("./assets/fonts/TitanOne-Regular.ttf"),
    "PoetsenOne-Regular": require("./assets/fonts/PoetsenOne-Regular.ttf"),
    "Freeman-Regular": require("./assets/fonts/Freeman-Regular.ttf"),
  });

  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      return;
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
