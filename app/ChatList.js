import { React, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

export default function ChatList({ navigation }) {
  const [getChatArray, setChatArray] = useState([]);
  const DATA = [
    {
      id: "1",
      other_user_name: "First user",
      other_user_status: "online",
      avatar_image_found: true,
      other_user_avatar: "https://reactnative.dev/img/tiny_logo.png",
      message: "Hello machan moko wenne ithin?",
      chat_status_id: "1",
    },
    {
      id: "2",
      other_user_name: "Second user",
      other_user_status: "offline",
      avatar_image_found: false,
      other_user_avatar: "AB",
      message: "Uberta wena wada nadda msg dada inne?",
      chat_status_id: "2",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <View style={styles.headlineWrapper}>
          <Text style={styles.headingText}>Chats</Text>
          <Pressable
            style={styles.settingsButton}
            onPress={() => {
              console.log("Settings Pressed");
            }}
          >
            <Ionicons name="settings-sharp" size={24} color="#FFC107" />
          </Pressable>
        </View>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            onChangeText={(text) => {
              console.log(text);
            }}
          />
        </View>
        <View style={styles.chatListView}>
          <FlashList
            data={DATA}
            renderItem={({ item }) => (
              <Pressable
                style={styles.chatOuterPressable}
                onPress={() => {
                  console.log("Single Chat Pressed");
                  navigation.navigate("Chat", item);
                }}
              >
                <View style={styles.chatInnerView}>
                  <View style={styles.chatImgUnreadWrapper}>
                    {/* <View style={styles.readMark}></View> */}
                    <View style={styles.unreadMark}></View>
                    {/* <View style={styles.chatUserImageOnline}> */}
                    <View style={styles.chatUserImageOffline}>
                      <Image
                        style={styles.chatUserImage}
                        source={{
                          uri: "https://reactnative.dev/img/tiny_logo.png",
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.chatTextWrapper}>
                    <Text style={styles.chatUserName}>
                      {item.other_user_name}
                    </Text>
                    <Text style={styles.chatUserLastMsg} numberOfLines={1}>
                      {item.message}
                    </Text>
                    <Text style={styles.chatLastMsgDate}>Friday</Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={24}
                    color="black"
                    style={styles.chevron}
                  />
                </View>
              </Pressable>
            )}
            refreshing={true}
            estimatedItemSize={400}
            onRefresh={() => {
              console.log("ChatList Refreshed");
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
    // justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 150,
    objectFit: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    fontFamily: "TitanOne-Regular",
    fontSize: 36,
    color: "#000",
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
  headlineWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    // backgroundColor: "coral",
  },
  settingsButton: {
    width: 35,
    height: 35,
    backgroundColor: "#000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ceccccf0",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 60,
    paddingLeft: 20,
  },
  chatListView: {
    flex: 1,
    width: "100%",
    // padding: 20,
    // backgroundColor: "coral",
  },
  chatOuterPressable: {
    width: "100%",
    padding: 20,
    paddingLeft: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ceccccf0",
  },
  chatInnerView: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatUserImageOnline: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderColor: "green",
    backgroundColor: "green",
    borderWidth: 5,
    borderBottomRightRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chatUserImageOffline: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderColor: "red",
    backgroundColor: "red",
    borderWidth: 5,
    borderBottomRightRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chatTextWrapper: {
    flex: 1,
    marginLeft: 20,
  },
  chatUserName: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "PoetsenOne-Regular",
  },
  chatUserLastMsg: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  chatLastMsgDate: {
    fontSize: 14,
    fontWeight: "300",
    color: "#000",
    position: "absolute",
    right: 0,
  },
  chatImgUnreadWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unreadMark: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: "#FFC107",
    margin: 10,
    borderWidth: 1,
    borderColor: "#000",
    opacity: 1,
  },
  readMark: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: "#FFC107",
    margin: 10,
    borderWidth: 2,
    borderColor: "#000",
    opacity: 0,
  },
});
