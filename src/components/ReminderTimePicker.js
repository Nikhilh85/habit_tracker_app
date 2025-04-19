import React, { useState } from "react";
import { View, Button, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const ReminderTimePicker = ({ reminderTime, setReminderTime }) => {
  const [show, setShow] = useState(false);

  const onChange = (e, selectedDate) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setReminderTime(selectedDate);
    }
  };

  const formatTime = (date) => {
    const hrs = date.getHours().toString().padStart(2, "0");
    const mins = date.getMinutes().toString().padStart(2, "0");
    return `${hrs}:${mins}`;
  };

  return (
    <View style={styles.container}>
      <Button
        style={styles.timerButton}
        title={formatTime(reminderTime)}
        onPress={() => setShow(true)}
      />
      {show && (
        <DateTimePicker
          mode="time"
          value={reminderTime}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 10,
  },
  timerButton: {
    borderRadius: 8,
  },
});

export default ReminderTimePicker;
