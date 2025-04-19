import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const fullDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DaySelector = ({ selectedDays, setSelectedDays }) => {
  const toggleDay = (index) => {
    const day = fullDays[index];
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <View style={styles.dayContainer}>
      {days.map((label, index) => {
        const isSelected = selectedDays.includes(fullDays[index]);
        return (
          <TouchableOpacity
            key={index}
            onPress={() => toggleDay(index)}
            style={[styles.dayButton, isSelected && styles.daySelected]}
          >
            <Text style={isSelected ? styles.selectedText : styles.dayText}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    color: "#333",
  },
  daySelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DaySelector;
