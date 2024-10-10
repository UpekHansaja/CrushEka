import { React, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { useFonts } from "expo-font";
import LoadFonts from "../components/LoadFonts";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp({ navigation }) {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  const profileIcon = () => {
    if (image != null) {
      return <Image source={{ uri: image }} style={styles.profileImg} />;
    } else {
      // obtain the first letter of the first name and last name
      return (
        <View style={styles.profileTextImg}>
          <Text style={styles.profileText}>
            {firstName.charAt(0).toUpperCase()}
            {lastName.charAt(0).toUpperCase()}
          </Text>
        </View>
      );
    }
  };

  const pickImage = async () => {
    try {
      // Request permission to access media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need permission to access your gallery."
        );
        return;
      }

      // Open image picker if permission is granted
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Set image URI if selection was successful
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
      <View style={styles.imgWrapper}>
        <Image
          source={require("../assets/CrushEka-Main-Logo.png")}
          style={styles.logo}
        />
        <Pressable
          style={styles.profileIconBtn}
          onPress={() => {
            console.log("Profile Icon Pressed");
            pickImage();
          }}
        >
          {profileIcon()}
        </Pressable>
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.bodyText}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            onChangeText={(text) => {
              setFirstName(text);
            }}
          />
          <Text style={styles.bodyText}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            onChangeText={(text) => {
              setLastName(text);
            }}
          />
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
          title="Register"
          onPress={async () => {
            console.log("Register Pressed");

            try {
              let formData = new FormData();
              formData.append("mobile", mobileNumber);
              formData.append("firstName", firstName);
              formData.append("lastName", lastName);
              formData.append("password", password);

              if (image != null) {
                formData.append("avatarImage", {
                  uri: image,
                  name: "avatar.jpg",
                  type: "image/jpg",
                });
              }

              const url = process.env.EXPO_PUBLIC_URL + "/SignUp";

              const response = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                  "Content-Type": "multipart/form-data",
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
                  Alert.alert("Error", json.message);
                }
              }
            } catch (error) {
              console.error(error);
            }
            // navigation.replace("ChatList");
          }}
        />
        <SecondaryButton
          title="Login"
          onPress={() => {
            console.log("Login");
            navigation.replace("SignIn");
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
    flex: 1,
    width: "100%",
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  imgWrapper: {
    flex: 0.4,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 150,
    objectFit: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImg: {
    width: 100,
    height: 100,
    objectFit: "contain",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#000",
    borderWidth: 3,
  },
  profileTextImg: {
    fontSize: 40,
    color: "#000",
    fontWeight: "500",
    borderRadius: 50,
    borderColor: "#000",
    borderWidth: 3,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC107",
  },
  profileText: {
    fontFamily: "TitanOne-Regular",
    fontSize: 40,
    color: "#000",
    fontWeight: "500",
  },
  profileIconBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    fontFamily: "PoetsenOne-Regular",
    fontSize: 20,
    color: "#000",
    fontWeight: "500",
  },
  bodyText: {
    fontSize: 16,
    color: "#000",
    marginTop: 15,
  },
  actionButtonWrapper: {
    flex: 0.6,
    width: "80%",
    // justifyContent: "flex-start",
    // justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    height: "100%",
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
