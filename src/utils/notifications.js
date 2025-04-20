import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HABIT_NOTIFY = "HABIT_NOTIFY";

export const updateHabitNotification = async (habitId, habit) => {
  await cancelHabitNotification(habitId);

  const [hour, minute] = habit.time.split(":").map(Number);

  const notifId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Reminder: ${habit.name}`,
      body: `Time to ${habit.name}`,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });

  const notifs = await AsyncStorage.getItem(HABIT_NOTIFY);
  const notifMap = notifs ? JSON.parse(notifs) : {};
  notifMap[habitId] = notifId;
  await AsyncStorage.setItem(HABIT_NOTIFY, JSON.stringify(notifMap));
};

export const cancelHabitNotification = async (habitId) => {
  const notifs = await AsyncStorage.getItem(HABIT_NOTIFY);
  const notifMap = notifs ? JSON.parse(notifs) : {};
  const notifId = notifMap[habitId];

  if (notifId) {
    await Notifications.cancelScheduledNotificationAsync(notifId);
    delete notifMap[habitId];
    await AsyncStorage.setItem(HABIT_NOTIFY, JSON.stringify(notifMap));
  }
};
