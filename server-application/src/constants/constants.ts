export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const MESSAGES = {
  SERVER_UPDATED: "Server updated successfully",
  SERVER_NOT_FOUND: "Server not found",
  CATEGORY_REQUIRED: "Category name is required",
  CATEGORY_EXISTS: "Category already exists",
  CATEGORY_CREATED: "Category created successfully",
  SERVER_SEEDED: "External servers seeded successfully",
  FETCH_ERROR: "An error occurred while fetching data",
  UPDATE_ERROR: "Failed to update server",
  CATEGORY_ERROR: "Failed to create category",
  SEED_ERROR: "Failed to seed external servers",

  USER_EXISTS: "User already exists",
  USER_REGISTERED: "User registered successfully",
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_NOT_FOUND: "User not found",
  UNAUTHORIZED: "Unauthorized",
  TOKEN_INVALID: "Invalid token",

  HEADLINES_FETCHED: "Headlines fetched successfully",
  SEARCH_SUCCESS: "News search completed",
  FETCH_AND_STORE_SUCCESS: "Articles fetched and stored by category",
  HEADLINES_ERROR: "Error fetching headlines",
  SEARCH_ERROR: "Search failed",
  FETCH_AND_STORE_ERROR: "Failed to fetch/store articles by category",

  NOTIFICATION_SAVED: "Notification preferences saved successfully",
  NOTIFICATION_SAVE_ERROR: "Failed to save preferences",
  EMAILS_SENT: "Notification emails sent.",
  EMAILS_FAILED: "Failed to send notification emails",

  ARTICLE_NOT_FOUND: "Article not found",
  ARTICLE_ALREADY_SAVED: "Article is already saved",
  ARTICLE_SAVED: "Article saved successfully",
  ARTICLE_DELETE_ERROR: "Error deleting saved article",
  ARTICLE_SAVE_ERROR: "Error saving article",
  ARTICLE_DELETED: "Removed from saved list",
  SAVED_NOT_FOUND: "Saved article not found",
  FETCH_SAVED_ERROR: "Error fetching saved articles",

  ARTICLE_REPORTED: "Article reported successfully",
  ALREADY_REPORTED: "You have already reported this article",
  REPORT_ERROR: "Failed to report article",
  ARTICLE_HIDDEN: "Article hidden",
  CATEGORY_HIDDEN: "Category hidden",
  KEYWORD_BLOCKED: "Keyword blocked",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};

export const DEFAULT_ROLE = "user";

export const TOKEN_EXPIRY = {
  REGISTER: "7d",
  LOGIN: "1d",
};

export const QUERY_DATE = {
  TODAY: "today",
  ALL: "all",
};

export const EMAIL = {
  SUBJECT: "Your News Notification",
  DIGEST_HEADER: "Your News Digest:",
  MAX_ARTICLES: 10,
};

export const REPORT_THRESHOLD = 5;
