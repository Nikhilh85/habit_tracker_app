import React from "react";
import { View, Text, Button } from "react-native";
// import { clearHabitsAndStatus } from "../utils/storage";

const Dashboard = ({ navigation }) => {
  // remove commented code before release build
  // (async () => {
  //   await clearHabitsAndStatus();
  // })();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Dashboard Screen</Text>
      <Button
        title="Go to Planner"
        onPress={() => navigation.navigate("Planner")}
      />
      <Button title="Habit" onPress={() => navigation.navigate("Habit Form")} />
    </View>
  );
};

export default Dashboard;
