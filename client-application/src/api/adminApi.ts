import axiosInstance from "./axiosInstance";

const ADMIN_API = axiosInstance; 

export const getReportedArticles = () =>
  ADMIN_API.get("/admin/reported-articles");

export const hideArticle = (articleId: string) =>
  ADMIN_API.post(`/admin/hide-article/${articleId}`);

export const getCategories = () =>
  ADMIN_API.get("/admin/categories");

export const hideCategories = (categories: string[]) =>
  ADMIN_API.post("/admin/hide-categories", { categories });

export const getBlockedKeywords = () =>
  ADMIN_API.get("/admin/blocked-keywords");

export const updateBlockedKeywords = (keywords: string[]) =>
  ADMIN_API.put("/admin/blocked-keywords", { keywords });
