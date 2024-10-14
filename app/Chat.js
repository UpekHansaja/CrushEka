import { React, useEffect, useRef, useState } from "react";
import {
  AppState,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Chat({ route, navigation }) {
  const param = route.params;
  console.log("Route Params:", param);

  const [getChatArray, setChatArray] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [msgValue, setMsgValue] = useState("");

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const fetchChat = async () => {
    try {
      const userJson = await AsyncStorage.getItem("USER");
      const user = JSON.parse(userJson);

      if (user != null) {
        const url =
          process.env.EXPO_PUBLIC_URL +
          "/LoadChat?logged_user_id=" +
          user.id +
          "&other_user_id=" +
          param.other_user_id;

        console.log("Fetching from URL:", url);

        const response = await fetch(url);
        const responseText = await response.text();
        console.log("Raw API Response:", responseText);

        if (response.ok) {
          const json = JSON.parse(responseText);
          console.log("Parsed JSON:", json);

          const chatArray = json || [];
          console.log("Chat Array:", chatArray);

          if (chatArray.length === 0) {
            console.log("No messages found in the chat");
            setError(
              "\n\n\n\n No messages yet..! \n\n Say Hi👋, to start a conversation!"
            );
          } else {
            setChatArray(chatArray);
            setError(null);
          }

          // setChatArray(JSON.stringify(json));
        } else {
          console.log("API Error:", response.status, responseText);
          setError(`Failed to load chat. Status: ${response.status}`);
        }
      } else {
        console.log("No User Found");
        navigation.replace("Home");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("An error occurred while loading the chat.");
    }
  };

  const setUserOfflineStatus = async () => {
    const userJson = await AsyncStorage.getItem("USER");
    const user = JSON.parse(userJson);

    if (user != null) {
      try {
        const url =
          process.env.EXPO_PUBLIC_URL + "/SetUserOffline?id=" + user.id;
        const response = await fetch(url);

        if (response.ok) {
          const json = await response.json();
          console.log("User Offline Status Set");

          if (json.success) {
            console.log(json.message);
          } else {
            console.log(json.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      fetchChat();
    }

    if (nextAppState === "background") {
      setUserOfflineStatus();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  useEffect(() => {
    const appStateHandel = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );

    fetchChat();

    return () => {
      appStateHandel.remove();
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchChat();
    setRefreshing(false);
  };

  const renderChatItem = ({ item }) => (
    <View
      style={
        item.side === "Right" ? styles.chatBubbleRight : styles.chatBubbleLeft
      }
    >
      <Text
        style={
          item.side === "Right"
            ? styles.chatBubbleTextRight
            : styles.chatBubbleTextLeft
        }
      >
        {item.message}
      </Text>
      <Text
        style={
          item.side === "Right"
            ? styles.chatBubbleTimeTextRight
            : styles.chatBubbleTimeTextLeft
        }
      >
        {item.datetime}
        &nbsp;&nbsp;
        {item.status == "1" ? (
          <AntDesign name="checkcircle" size={14} color="black" />
        ) : (
          <AntDesign name="checkcircleo" size={14} color="black" />
        )}
      </Text>
    </View>
  );

  const sendMessage = async () => {
    try {
      const userJson = await AsyncStorage.getItem("USER");
      const user = JSON.parse(userJson);

      console.log("Send From User:", user);
      if (user != null) {
        const url =
          process.env.EXPO_PUBLIC_URL +
          "/SendChat?logged_user_id=" +
          user.id +
          "&other_user_id=" +
          param.other_user_id +
          "&message=" +
          message;

        const response = await fetch(url);

        if (response.ok) {
          const json = await response.json();
          console.log(json);

          if (json.success) {
            console.log("Message Sent Successfully");
            setMessage("");
            await fetchChat();
            setMsgValue("");
          } else {
            console.log("Failed to send the message");
            setError(json.message);
          }
        } else {
          console.log("API Error:", response.status, response);
          setError(`Failed to send the message. Status: ${response.status}`);
        }
      } else {
        console.log("No User Found");
        navigation.replace("Home");
      }
    } catch (error) {
      console.error("Send Error:", error);
      setError("An error occurred while sending the message.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
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
            {param.avatar_image_found ? (
              <Image
                style={styles.chatUserImage}
                source={{ uri: param.avatar_image_path }}
              />
            ) : (
              <View style={styles.profileTextImg}>
                <Text style={styles.profileText}>
                  {param.other_user_avatar}
                </Text>
              </View>
            )}
            <View style={styles.chatUserDetails}>
              <Text style={styles.chatUserName}>{param.other_user_name}</Text>
              {param.other_user_status === 1 ? (
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
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlashList
            data={getChatArray}
            renderItem={renderChatItem}
            keyExtractor={(item, index) => index.toString()}
            refreshing={refreshing}
            estimatedItemSize={600}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No messages yet.</Text>
            }
          />
        )}
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your message here"
          numberOfLines={2}
          value={msgValue}
          onChangeText={(text) => {
            console.log(text);
            setMessage(text);
            setMsgValue(text);
          }}
        />
        <Pressable
          style={styles.settingsButton}
          onPress={() => {
            console.log("Send Pressed");
            sendMessage();
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
  profileTextImg: {
    fontSize: 40,
    color: "#000",
    fontWeight: "500",
    borderRadius: 25,
    borderColor: "#000",
    borderWidth: 3,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC107",
  },
  profileText: {
    fontFamily: "TitanOne-Regular",
    fontSize: 20,
    color: "#000",
  },
  errorText: {
    color: "#4b4b4b",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
