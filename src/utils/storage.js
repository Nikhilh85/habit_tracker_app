// storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const HABITS_KEY = "HABITS_LIST";

export const saveHabit = async (habit) => {
  try {
    const existing = await getHabits();
    console.log("called");
    const updated = [...existing, habit];
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Save error", e);
  }
};

export const getHabits = async () => {
  try {
    const json = await AsyncStorage.getItem(HABITS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Load error", e);
    return [];
  }
};

export const clearHabits = async () => {
  try {
    await AsyncStorage.removeItem(HABITS_KEY);
  } catch (e) {
    console.error("Clear error", e);
  }
};
