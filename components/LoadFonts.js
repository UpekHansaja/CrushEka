import { React, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function LoadFonts() {
  const [loaded, error] = useFonts({
    "TitanOne-Regular": require("../assets/fonts/TitanOne-Regular.ttf"),
    "PoetsenOne-Regular": require("../assets/fonts/PoetsenOne-Regular.ttf"),
    "Freeman-Regular": require("../assets/fonts/Freeman-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      return;
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return null;
}
