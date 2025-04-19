import * as Notifications from "expo-notifications";

export const scheduleHabitNotification = async (habit) => {
  const [hour, minute] = habit.time.split(":").map(Number);

  const trigger = {
    hour,
    minute,
    repeats: true,
  };

  const content = {
    title: `${habit.name}`,
    body: `It's time for your habit!`,
    sound: true,
  };

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
};

export const cancelHabitNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error cancelling notification:", error);
  }
};
