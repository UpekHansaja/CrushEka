import { React, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

export default function SignIn({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <Image
          source={require("../assets/CrushEka-Main-Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.headingText}>Hey, Welcome to back..!</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.bodyText}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="07XXXXXXXX"
            inputMode="numeric"
          />
          <Text style={styles.bodyText}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="XXXXXXXX"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.actionButtonWrapper}>
          <PrimaryButton
            title="Login"
            onPress={() => {
              console.log("Login");
            }}
          />
          <SecondaryButton
            title="Register"
            onPress={() => {
              console.log("Register");
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
    color: "#300359",
  },
  bodyText: {
    fontSize: 16,
    color: "#300359",
    marginTop: 10,
  },
  actionButtonWrapper: {
    flex: 0.5,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    width: "80%",
    justifyContent: "center",
    marginTop: 20,
  },
  input: {
    marginTop: 10,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 60,
    paddingLeft: 20,
  },
});
