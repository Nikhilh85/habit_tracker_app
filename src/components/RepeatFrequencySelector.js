import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RepeatFrequencySelector = ({ repeatFrequency, setRepeatFrequency }) => {
  return (
    <View style={styles.repeatContainer}>
      <View style={styles.repeatOptions}>
        {["Weekly", "Biweekly", "Monthly"].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setRepeatFrequency(option)}
            style={[
              styles.repeatButton,
              repeatFrequency === option && styles.repeatSelected,
            ]}
          >
            <Text
              style={
                repeatFrequency === option
                  ? styles.selectedText
                  : styles.repeatText
              }
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  repeatContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  repeatOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  repeatButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  repeatText: {
    fontSize: 16,
    color: "#555",
  },
  repeatSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
});

export default RepeatFrequencySelector;
