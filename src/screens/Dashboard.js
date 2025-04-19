import React from "react";
import { View, Text, Button } from "react-native";

const Dashboard = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Dashboard Screen</Text>
      <Button
        title="Go to Planner"
        onPress={() => navigation.navigate("Planner")}
      />
      <Button title="Habit" onPress={() => navigation.navigate("HabitForm")} />
    </View>
  );
};

export default Dashboard;
