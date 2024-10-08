import { React, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  useEffect(() => {
    const fetchUser = async () => {
      console.log("Home Page");
      try {
        const jsonValue = await AsyncStorage.getItem("user");
        if (jsonValue != null) {
          const USER = JSON.parse(jsonValue);
          console.log(USER);
          navigation.replace("ChatList");
        } else {
          console.log("No User Found");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <Image
          source={require("../assets/CrushEka-Main-Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.headingText}>Welcome to CrushEka..!</Text>
        <Text style={styles.bodyText}>
          The Sri Lankan 1st LGBTQ+ Dating App
        </Text>
        <View style={styles.actionButtonWrapper}>
          <PrimaryButton
            title="Login"
            onPress={() => {
              console.log("Login");
              navigation.replace("SignIn");
            }}
          />
          <SecondaryButton
            title="Register"
            onPress={() => {
              console.log("Register");
              navigation.replace("SignUp");
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 150,
    objectFit: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    fontFamily: "PoetsenOne-Regular",
    fontSize: 24,
    color: "#000",
    marginTop: 20,
    fontWeight: "600",
  },
  bodyText: {
    fontSize: 16,
    color: "#000",
    marginTop: 15,
  },
  actionButtonWrapper: {
    // flex: 0.5,
    height: "40%",
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
});
