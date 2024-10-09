import { React, useEffect, useState } from "react";
import {
  Alert,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn({ navigation }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

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
            onChangeText={(text) => {
              setMobileNumber(text);
            }}
          />
          <Text style={styles.bodyText}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="XXXXXXXX"
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.actionButtonWrapper}>
        <PrimaryButton
          title="Login"
          onPress={async () => {
            console.log("Login");

            try {
              const url = process.env.EXPO_PUBLIC_URL + "/SignIn";

              const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                  mobile: mobileNumber,
                  password: password,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                const json = await response.json();
                console.log(json);

                if (json.success) {
                  const jsonUserValue = JSON.stringify(json.user);
                  await AsyncStorage.setItem("USER", jsonUserValue);

                  await AsyncStorage.getItem("USER").then((value) => {
                    console.log("Saved USER: " + value);
                    navigation.replace("ChatList");
                  });
                } else {
                  console.log("Login Failed");

                  Alert.alert("Login Failed", json.message);
                }
              }
            } catch (error) {
              console.error(error);
            }
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
