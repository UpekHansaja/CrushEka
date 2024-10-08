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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";

export default function Chat({ route, navigation }) {
  const param = route.params;
  // const chatUserData = JSON.stringify(param);
  console.log(param);

  const [getChatArray, setChatArray] = useState([]);

  const DATA = [
    {
      id: "1",
      message: "Hello machan moko wenne ithin?",
      datetime: "12:01 PM",
      chat_status_id: "1",
      side: "Right",
      status: "Seen",
    },
    {
      id: "2",
      message: "Ane bn me paduwe idahnko wdak naththam",
      datetime: "13:35 PM",
      chat_status_id: "2",
      side: "Left",
      status: "Seen",
    },
    {
      id: "1",
      message: "Ow ow ubta kollek msg dammoth thama okkoma",
      datetime: "12:01 PM",
      chat_status_id: "1",
      side: "Right",
      status: "Seen",
    },
    {
      id: "1",
      message: "Aye warenko tho 😓",
      datetime: "12:01 PM",
      chat_status_id: "1",
      side: "Right",
      status: "Sent",
    },
    {
      id: "2",
      message: "Ane bn me paduwe idahnko wdak naththam",
      datetime: "13:35 PM",
      chat_status_id: "2",
      side: "Left",
      status: "Seen",
    },
    {
      id: "1",
      message: "Ow ow ubta kollek msg dammoth thama okkoma",
      datetime: "12:01 PM",
      chat_status_id: "1",
      side: "Right",
      status: "Sent",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headlineWrapper}>
        <Pressable
          onPress={() => {
            console.log("Back Pressed");
            navigation.navigate("ChatList");
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Pressable
          onPress={() => {
            console.log("User Profile Pressed");
          }}
          style={styles.userDetailButton}
        >
          <View style={styles.headerUserWrapper}>
            <Image
              style={styles.chatUserImage}
              source={{
                uri: "https://reactnative.dev/img/tiny_logo.png",
              }}
            />
            <View style={styles.chatUserDetails}>
              <Text style={styles.chatUserName}>{param.other_user_name}</Text>
              {param.other_user_status === "Online" ? (
                <Text style={styles.onlineText}>
                  <FontAwesome name="circle" size={12} color="green" /> Online
                </Text>
              ) : (
                <Text style={styles.offlineText}>
                  <FontAwesome name="circle" size={12} color="red" /> Offline
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      </View>

      <View style={styles.chatListView}>
        <FlashList
          data={DATA}
          renderItem={({ item }) => (
            <View
              style={
                item.side == "Right"
                  ? styles.chatBubbleRight
                  : styles.chatBubbleLeft
              }
            >
              <View>
                <Text
                  style={
                    item.side == "Right"
                      ? styles.chatBubbleTextRight
                      : styles.chatBubbleTextLeft
                  }
                >
                  {item.message}
                </Text>
              </View>
              <View>
                <Text
                  style={
                    item.side == "Right"
                      ? styles.chatBubbleTimeTextRight
                      : styles.chatBubbleTimeTextLeft
                  }
                >
                  {item.datetime}
                  &nbsp;&nbsp;
                  {item.status == "Seen" ? (
                    <AntDesign name="checkcircle" size={14} color="black" />
                  ) : (
                    <AntDesign name="checkcircleo" size={14} color="black" />
                  )}
                </Text>
              </View>
            </View>
          )}
          refreshing={true}
          estimatedItemSize={600}
          onRefresh={() => {
            console.log("Refreshed");
          }}
        />
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your message here"
          numberOfLines={2}
          onChangeText={(text) => {
            console.log(text);
          }}
        />
        <Pressable
          style={styles.settingsButton}
          onPress={() => {
            console.log("Send Pressed");
          }}
        >
          <FontAwesome name="send" size={18} color="#FFC107" />
        </Pressable>
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
    paddingHorizontal: 20,
    marginVertical: 5,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "space-around",
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
    fontSize: 24,
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
    // justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ceccccf0",
  },
  settingsButton: {
    width: 35,
    height: 35,
    backgroundColor: "#000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 25,
  },
  searchWrapper: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ceccccf0",
  },
  input: {
    width: "90%",
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
  headerUserWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineText: {
    fontSize: 13,
    color: "green",
  },
  offlineText: {
    fontSize: 13,
    color: "red",
  },
  chatUserDetails: {
    marginLeft: 20,
  },
  userDetailButton: {
    // backgroundColor: "coral",
    width: "85%",
    marginLeft: 20,
  },
  chatBubbleRight: {
    backgroundColor: "#FFC107",
    padding: 15,
    maxWidth: "70%",
    borderRadius: 10,
    margin: 10,
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  chatBubbleLeft: {
    backgroundColor: "#000",
    maxWidth: "75%",
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  chatBubbleTextRight: {
    color: "#000",
    fontSize: 15,
  },
  chatBubbleTextLeft: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  chatBubbleTimeTextRight: {
    marginTop: 5,
    color: "#4b4b4b",
    fontSize: 13,
    textAlign: "right",
    fontWeight: "400",
  },
  chatBubbleTimeTextLeft: {
    marginTop: 5,
    color: "#e0e0e0",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
});
