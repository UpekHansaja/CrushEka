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
      <Image
        source={require("../assets/CrushEka-Main-Logo.png")}
        style={styles.logo}
      />
      <Text style={styles.headingText}>Hey, Welcome to back..!</Text>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
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
      </KeyboardAvoidingView>
      <View style={styles.actionButtonWrapper}>
        <PrimaryButton
          title="Login"
          onPress={() => {
            console.log("Login");
            navigation.replace("ChatList");
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
    flex: 0.45,
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
    fontWeight: "500",
  },
  bodyText: {
    fontSize: 16,
    color: "#000",
    marginTop: 15,
  },
  actionButtonWrapper: {
    flex: 0.4,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 0.4,
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
