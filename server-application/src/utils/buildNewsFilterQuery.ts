import AdminSettings from "../models/AdminSettings";

export const buildNewsFilterQuery = async (filters: any) => {
  const query: any = {
    isHidden: false, 
  };

  const { date, start, end, category, keyword } = filters;

  if (date === "today") {
    const now = new Date();
    query.publishedAt = {
      $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    };
  } else if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1);
    query.publishedAt = { $gte: startDate, $lt: endDate };
  }

  if (category) {
    query.category = category;
  }

  const settings = await AdminSettings.findOne();

  if (settings?.blockedCategories?.length) {
    if (query.category) {
      query.category = {
        $eq: query.category,
        $nin: settings.blockedCategories,
      };
    } else {
      query.category = { $nin: settings.blockedCategories };
    }
  }

  if (settings?.blockedKeywords?.length) {
    const regexes = settings.blockedKeywords.map(
      (word) => new RegExp(`\\b${word}\\b`, "i")
    );

    query.$and = [
      ...(query.$and || []),
      {
        $nor: [
          { title: { $in: regexes } },
          { description: { $in: regexes } },
          { content: { $in: regexes } },
        ],
      },
    ];
  }

  return query;
};
