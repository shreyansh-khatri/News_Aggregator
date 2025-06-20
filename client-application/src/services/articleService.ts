import axiosInstance from "../api/axiosInstance";

export interface Article {
  _id: string;
  title: string;
  description: string;
  publishedAt: string;
}

export const saveArticle = async (articleId: string): Promise<void> => {
  await axiosInstance.post("/saved/save", { articleId });
};

export const deleteArticle = async (articleId: string): Promise<void> => {
  await axiosInstance.delete(`/saved/save/${articleId}`);
};

export const getSavedArticles = async (): Promise<Article[]> => {
  const res = await axiosInstance.get("/saved/saved");
  return res.data.savedArticles;
};
