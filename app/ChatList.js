import { React, useEffect, useState } from "react";
import {
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
import { FlashList } from "@shopify/flash-list";
import { router, SplashScreen } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";

export default function ChatList({ navigation }) {
  const [getChatArray, setChatArray] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [defaulImgPath, setDefaultImgPath] = useState(
    "https://img.icons8.com/pulsar-color/100/user.png"
  );

  const fetchChatList = async () => {
    const userJson = await AsyncStorage.getItem("USER");
    const user = JSON.parse(userJson);

    if (user != null) {
      console.log(user);

      try {
        const url = process.env.EXPO_PUBLIC_URL + "/LoadHomeData?id=" + user.id;

        const response = await fetch(url);

        if (response.ok) {
          const json = await response.json();
          console.log(json);

          if (json.success) {
            const chatArray = json.jsonChatArray;
            // const descOrderChatArray = chatArray.reverse();
            // setChatArray(descOrderChatArray);
            setChatArray(chatArray);
          } else {
            console.log(json.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No User Found");
      navigation.replace("SignIn");
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true); // Start refreshing
    await fetchChatList(); // Fetch data
    setRefreshing(false); // Stop refreshing
  };

  // const formatTime = (dateString) => {
  //   // Split date and time
  //   const [year, month, day, time, period] = dateString
  //     .replace(",", "")
  //     .split(" ");

  //   // Split time into hours and minutes
  //   let [hours, minutes] = time.split(":").map(Number);

  //   // Convert 12-hour format to 24-hour format if PM
  //   if (period === "PM" && hours !== 12) {
  //     hours += 12;
  //   } else if (period === "AM" && hours === 12) {
  //     hours = 0;
  //   }

  //   // Format the hours back to 12-hour format
  //   const formattedHours = hours % 12 || 12;

  //   // Ensure minutes are always two digits
  //   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  //   // Return the formatted time with AM/PM
  //   return `${formattedHours}:${formattedMinutes} ${period}`;
  // };

  function formatTime(dateString) {
    // Parse the date string with Luxon, specifying the format
    const date = DateTime.fromFormat(dateString, "yyyy, LLL dd hh:mm a");

    // Check if the date is valid
    if (!date.isValid) {
      console.error("Failed to parse date:", dateString);
      return dateString; // Return the original string on error
    }

    const now = DateTime.now();
    const differenceInDays = Math.floor(now.diff(date, "days").days);

    // Today
    if (differenceInDays === 0) {
      return date.toFormat("hh:mm a");
    }

    // Yesterday
    if (differenceInDays === 1) {
      return "Yesterday";
    }

    // Less than a week ago
    if (differenceInDays < 7) {
      return date.toFormat("dd EEEE");
    }

    // Within the last year
    if (now.year === date.year) {
      return date.toFormat("LLL dd");
    }

    // More than 12 months ago
    return date.toFormat("yyyy-LL-dd");
  }

  // Example usage
  console.log(formatTime("2024, Oct 09 04:27 PM")); // Adjusted output based on the current date

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
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
            data={getChatArray}
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
                    <View
                      style={
                        item.chat_status_id == 1
                          ? styles.readMark
                          : styles.unreadMark
                      }
                    ></View>
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
                          source={{
                            uri: item.avatar_image_path,
                          }}
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
            onRefresh={() => {
              console.log("ChatList Refreshed");
              handleRefresh();
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
