import axios from "../api/axiosInstance";

export const updateNotificationPreferences = async (
  categories: string[],
  keywords: string[]
): Promise<void> => {
  await axios.put("/notifications/configure", {
    categories,
    keywords,
  });
};
