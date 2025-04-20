import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import EmojiModal from "react-native-emoji-modal";
import { useRoute } from "@react-navigation/native";
import DaySelector from "../components/DaySelector";
import RepeatFrequencySelector from "../components/RepeatFrequencySelector";
import { getHabits, saveHabit } from "../utils/storage";
import { updateHabitNotification } from "../utils/notifications";
import ReminderTimePicker from "../components/ReminderTimePicker";

const HabitForm = ({ navigation }) => {
  const route = useRoute();

  const [habitName, setHabitName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatFrequency, setRepeatFrequency] = useState("Weekly");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [editingHabitId, setEditingHabitId] = useState(null);

  const parseTimeStringToDate = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  useEffect(() => {
    if (route.params?.habitToEdit) {
      const h = route.params.habitToEdit;
      setHabitName(h.name);
      setEmoji(h.icon);
      setSelectedDays(h.days);
      setRepeatFrequency(h.repeat);
      setReminderTime(parseTimeStringToDate(h.time));
      setEditingHabitId(h.id);
    }
  }, [route.params]);

  const handleSave = async () => {
    if (!habitName || !emoji || selectedDays.length === 0) {
      alert("Please fill in all fields");
      return;
    }

    const habits = await getHabits();

    const timeStr = `${reminderTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${reminderTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const newHabit = {
      id: Date.now().toString(),
      name: habitName.trim(),
      icon: emoji,
      days: selectedDays,
      repeat: repeatFrequency,
      time: timeStr,
      createdAt: new Date().toISOString(),
    };

    let updated;
    if (editingHabitId) {
      updated = habits.map((h) => (h.id === editingHabitId ? newHabit : h));
      await updateHabitNotification(editingHabitId, newHabit);
    } else {
      updated = [...habits, newHabit];
    }
    await saveHabit(updated);
    if (!editingHabitId) await updateHabitNotification(newHabit.id, newHabit);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {editingHabitId ? (
        <Text style={styles.title}>Edit Habit</Text>
      ) : (
        <Text style={styles.title}>Create New Habit</Text>
      )}

      <Text style={styles.label}>Habit Name</Text>
      <TextInput
        value={habitName}
        onChangeText={setHabitName}
        placeholder="e.g., Drink Water"
        style={styles.input}
      />

      <Text style={styles.label}>Emoji</Text>
      <TouchableOpacity
        onPress={() => setEmojiModalVisible(true)}
        style={styles.emojiButton}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.emojiText}>Tap to change</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Select Days</Text>
      <DaySelector
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
      />

      <Text style={styles.label}>Repeat Frequency</Text>
      <RepeatFrequencySelector
        repeatFrequency={repeatFrequency}
        setRepeatFrequency={setRepeatFrequency}
      />

      <Text style={styles.label}>Time Reminder</Text>
      <ReminderTimePicker
        reminderTime={reminderTime}
        setReminderTime={setReminderTime}
      />

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Habit</Text>
      </TouchableOpacity>

      <Modal visible={emojiModalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <EmojiModal
              onEmojiSelected={(emoji) => {
                setEmoji(emoji);
                setEmojiModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  emojiButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  emoji: {
    fontSize: 28,
    marginRight: 10,
  },
  emojiText: {
    fontSize: 16,
    color: "#555",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    borderRadius: 12,
    padding: 10,
  },
});

export default HabitForm;
