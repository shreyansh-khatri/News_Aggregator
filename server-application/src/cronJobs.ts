import cron from "node-cron";
import { fetchAndStoreByCategory } from "./services/fetchAndStoreByCategory";
import NotificationService from "./services/NotificationService";
import AdminController from "./controllers/AdminController";

const runFetchAndStoreJob = async () => {
  console.log(
    `[${new Date().toISOString()}] Running fetchAndStoreByCategory job`
  );
  try {
    await fetchAndStoreByCategory();
    console.log(
      `[${new Date().toISOString()}] fetchAndStoreByCategory executed successfully`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error executing fetchAndStoreByCategory:`,
      error
    );
  }

  try {
    await AdminController.checkAndUpdateServerStatuses(
      {} as any,
      { status: () => ({ json: () => {} }) } as any
    );
    console.log(
      `[${new Date().toISOString()}] Server statuses updated successfully`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error updating server statuses:`,
      error
    );
  }
};

const runNotificationJob = async () => {
  console.log(`[${new Date().toISOString()}] Sending notification emails...`);
  try {
    await NotificationService.sendNotificationEmailsJob();
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Notification Cron Job Error:`,
      error
    );
  }
};

export const runCronJobs = () => {
  runFetchAndStoreJob(); 

  cron.schedule("0 */3 * * *", runFetchAndStoreJob); 
  cron.schedule("0 */3 * * *", runNotificationJob); 
};
