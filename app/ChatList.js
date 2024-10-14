import { React, useEffect, useState, useRef } from "react";
import {
  Alert,
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
  AppState,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { router, SplashScreen } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ChatList({ navigation }) {
  const [getChatArray, setChatArray] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [savedUser, setSavedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const fetchChatList = async () => {
    const userJson = await AsyncStorage.getItem("USER");
    const user = JSON.parse(userJson);

    if (user != null) {
      setSavedUser(user);

      try {
        const url = process.env.EXPO_PUBLIC_URL + "/LoadHomeData?id=" + user.id;
        const response = await fetch(url);

        if (response.ok) {
          const json = await response.json();
          // console.log("ChatList Fetched");

          if (json.success) {
            const chatArray = json.jsonChatArray;
            setChatArray(chatArray);
          } else {
            console.log(json.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      navigation.replace("SignIn");
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
      fetchChatList();
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
    pollingChatList();

    return () => {
      appStateHandel.remove();
    };
  }, []);

  const pollingChatList = async () => {
    const interval = setInterval(async () => {
      // console.log("Polling Chat List");
      await fetchChatList();
    });

    return () => clearInterval(interval);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchChatList();
    setRefreshing(false);
  };

  const filteredChats = getChatArray.filter((chat) =>
    chat.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatTime(dateString) {
    const date = DateTime.fromFormat(dateString, "yyyy, LLL dd hh:mm a");
    if (!date.isValid) {
      console.error("Failed to parse date:", dateString);
      return dateString;
    }

    const now = DateTime.now();
    const differenceInDays = Math.floor(now.diff(date, "days").days);

    if (differenceInDays === 0) {
      return date.toFormat("hh:mm a");
    }
    if (differenceInDays === 1) {
      return "Yesterday";
    }
    if (differenceInDays < 7) {
      return date.toFormat("ccc");
    }
    if (now.year === date.year) {
      return date.toFormat("LLL dd");
    }
    return date.toFormat("yyyy LLL dd");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
        <View style={styles.headlineWrapper}>
          <Text style={styles.headingText}>Chats</Text>
          <Pressable
            style={styles.settingsButton}
            onPress={() => {
              Alert.prompt(
                "Log-Out",
                "Are you sure you want to logout?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "LogOut",
                    onPress: async () => {
                      await setUserOfflineStatus();
                      await AsyncStorage.removeItem("USER");
                      navigation.replace("Home");
                    },
                  },
                ],
                "default"
              );
            }}
          >
            <FontAwesome name="power-off" size={24} color="#FFC107" />
          </Pressable>
        </View>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            onChangeText={(text) => setSearchQuery(text)} // Update search query state
          />
        </View>
        <View style={styles.chatListView}>
          <FlashList
            data={filteredChats} // Use the filtered chat array
            renderItem={({ item }) => (
              <Pressable
                style={styles.chatOuterPressable}
                onPress={() => navigation.navigate("Chat", item)}
              >
                <View style={styles.chatInnerView}>
                  <View style={styles.chatImgUnreadWrapper}>
                    {item.from_logged_user ? (
                      <View style={styles.readMark}></View>
                    ) : (
                      <View
                        style={
                          item.chat_status_id == 1
                            ? styles.readMark
                            : styles.unreadMark
                        }
                      ></View>
                    )}
                    <View
                      style={
                        item.other_user_status == 1
                          ? styles.chatUserImageOnline
                          : styles.chatUserImageOffline
                      }
                    >
                      {item.avatar_image_found ? (
                        <Image
                          style={styles.chatUserImage}
                          source={{ uri: item.avatar_image_path }}
                        />
                      ) : (
                        <View style={styles.profileTextImg}>
                          <Text style={styles.profileText}>
                            {item.other_user_avatar}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.chatTextWrapper}>
                    <Text style={styles.chatUserName} numberOfLines={1}>
                      {item.other_user_name}
                    </Text>
                    <Text style={styles.chatUserLastMsg} numberOfLines={1}>
                      {item.message}
                    </Text>
                    <Text style={styles.chatLastMsgDate}>
                      {formatTime(item.dateTime)}
                    </Text>
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
            refreshing={refreshing}
            estimatedItemSize={400}
            onRefresh={handleRefresh}
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
    borderColor: "#04a704",
    backgroundColor: "#04a704",
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
    paddingEnd: 60,
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
});
