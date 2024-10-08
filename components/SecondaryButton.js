import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function SecondaryButton({ title, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#FFC107",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 20,
    fontFamily: "PoetsenOne-Regular",
    fontWeight: "400",
  },
});
