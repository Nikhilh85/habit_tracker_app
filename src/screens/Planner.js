import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getHabits,
  getHabitStatus,
  HABITS_KEY,
  saveHabitStatus,
} from "../utils/storage";
import { fullDays } from "../components/DaySelector";

dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);

const getWeekDays = (offset = 0) => {
  const startOfWeek = dayjs().add(offset, "week").startOf("week");
  return [...Array(7)].map((_, i) => startOfWeek.add(i, "day"));
};

const Planner = ({ navigation }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDays, setWeekDays] = useState(getWeekDays());
  const [habits, setHabits] = useState([]);
  const [habitStatus, setHabitStatus] = useState({});

  useFocusEffect(
    useCallback(() => {
      const fetchHabits = async () => {
        const data = await getHabits();
        const habitStatus = await getHabitStatus();
        setHabits(data);
        setHabitStatus(habitStatus);
      };

      fetchHabits();
    }, [])
  );

  useEffect(() => {
    setWeekDays(getWeekDays(weekOffset));
  }, [weekOffset]);

  const updateHabitStatus = async (dateStr, habitId, status) => {
    const key = `${dateStr}_${habitId}`;

    const newStatus = {
      ...habitStatus,
      [key]: status,
    };

    setHabitStatus(newStatus);

    await saveHabitStatus(newStatus);
  };

  const handleDeleteHabit = async (habitId) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
    await cancelHabitNotification(habitId);
  };

  const handleEditHabit = (habit) => {
    navigation.navigate("Habit Form", { habitToEdit: habit });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.weekNav}>
        <TouchableOpacity onPress={() => setWeekOffset((o) => o - 1)}>
          <Text style={styles.navText}>⬅️ Prev</Text>
        </TouchableOpacity>
        <Text style={styles.navText}>
          Week of {weekDays[0].format("MMM D")}
        </Text>
        <TouchableOpacity onPress={() => setWeekOffset((o) => o + 1)}>
          <Text style={styles.navText}>Next ➡️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {weekDays.map((date) => {
          const dateStr = date.format("YYYY-MM-DD");
          return (
            <View key={dateStr} style={styles.dayBlock}>
              <Text style={styles.dateText}>{date.format("dddd, MMM D")}</Text>

              {habits
                .filter((habit) => {
                  const habitDay = fullDays[date.day()];
                  const createdAt = dayjs(habit.createdAt).startOf("day");
                  const current = dayjs(date).startOf("day");
                  if (!current.isSameOrAfter(createdAt)) return false;
                  if (!habit.days.includes(habitDay)) return false;
                  switch (habit.repeat) {
                    case "Weekly":
                      return true;
                    case "Biweekly": {
                      const weekDiff = current.diff(createdAt, "week");
                      return weekDiff % 2 === 0;
                    }
                    case "Monthly": {
                      const createdWeekOfMonth = Math.floor(
                        (createdAt.date() - 1) / 7
                      );
                      const currentWeekOfMonth = Math.floor(
                        (current.date() - 1) / 7
                      );
                      return createdWeekOfMonth === currentWeekOfMonth;
                    }
                    default:
                      return true;
                  }
                })
                .map((habit) => {
                  const key = `${dateStr}_${habit.id}`;
                  const status = habitStatus[key];

                  return (
                    <View key={habit.id + dateStr} style={styles.habitCard}>
                      <Text style={styles.habitName}>
                        {habit.icon} {habit.name}
                      </Text>
                      <View style={styles.btnRow}>
                        <TouchableOpacity
                          style={styles.btn}
                          onPress={() => handleEditHabit(habit)}
                        >
                          <Text>✏️ Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.btn}
                          onPress={() => handleDeleteHabit(habit.id)}
                        >
                          <Text>🗑 Delete</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.btnRow}>
                        <TouchableOpacity
                          style={[
                            styles.btn,
                            status === "done" && styles.btnDone,
                          ]}
                          onPress={() =>
                            updateHabitStatus(dateStr, habit.id, "done")
                          }
                        >
                          <Text>✅ Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.btn,
                            status === "missed" && styles.btnMissed,
                          ]}
                          onPress={() =>
                            updateHabitStatus(dateStr, habit.id, "missed")
                          }
                        >
                          <Text>❌ Missed</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  weekNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dayBlock: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  habitCard: {
    padding: 10,
    backgroundColor: "#e7e7e7",
    borderRadius: 8,
    marginBottom: 8,
  },
  habitName: {
    fontSize: 16,
    marginBottom: 6,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  btn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#ccc",
    width: "48%",
    alignItems: "center",
  },
  btnDone: {
    backgroundColor: "#b2f2bb",
  },
  btnMissed: {
    backgroundColor: "#ffa8a8",
  },
});

export default Planner;
