import AsyncStorage from "@react-native-async-storage/async-storage";

export const HABITS_KEY = "HABITS_LIST";
export const HABITS_STATUS = "HABIT_STATUS";

export const saveHabit = async (habits) => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
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

export const clearHabitsAndStatus = async () => {
  try {
    await AsyncStorage.removeItem(HABITS_KEY);
    await AsyncStorage.removeItem(HABITS_STATUS);
  } catch (e) {
    console.error("Clear error", e);
  }
};

export const saveHabitStatus = async (newStatus) => {
  try {
    await AsyncStorage.setItem(HABITS_STATUS, JSON.stringify(newStatus));
  } catch (e) {
    console.error("Failed to save habit status:", e);
  }
};

export const getHabitStatus = async () => {
  try {
    const json = await AsyncStorage.getItem(HABITS_STATUS);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Load error", e);
    return [];
  }
};
