import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ProgressBar, Button } from "react-native-paper";
import { getHabits, getHabitStatus } from "../utils/storage";

const Dashboard = ({ navigation }) => {
  const [analytics, setAnalytics] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const habitData = await getHabits();
        const statusData = await getHabitStatus();

        const stats = habitData.map((habit) => {
          const statusEntries = Object.entries(statusData).filter(([key]) =>
            key.endsWith(`_${habit.id}`)
          );

          const doneCount = statusEntries.filter(
            ([, status]) => status === "done"
          ).length;
          const missedCount = statusEntries.filter(
            ([, status]) => status === "missed"
          ).length;

          const total = doneCount + missedCount;
          const progress = total ? doneCount / total : 0;

          return {
            ...habit,
            doneCount,
            missedCount,
            total,
            progress,
          };
        });

        setAnalytics(stats);
      };

      fetchData();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {analytics.length === 0 ? (
        <Text style={styles.noData}>No habits found.</Text>
      ) : (
        analytics.map((habit) => (
          <View key={habit.id} style={styles.card}>
            <Text style={styles.habitName}>
              {habit.icon} {habit.name}
            </Text>
            <ProgressBar
              progress={habit.progress}
              color="#4caf50"
              style={styles.progressBar}
            />
            <Text style={styles.stats}>
              ✅ Done: {habit.doneCount} | ❌ Missed: {habit.missedCount} | 📅
              Total: {habit.total}
            </Text>
          </View>
        ))
      )}

      <Button
        mode="outlined"
        style={styles.plannerBtn}
        onPress={() => navigation.navigate("Planner")}
      >
        Go to Planner
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("Habit Form")}>
        Create a Habit
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  stats: {
    fontSize: 14,
    color: "#555",
  },
  plannerBtn: {
    marginBottom: 15,
  },
});

export default Dashboard;
