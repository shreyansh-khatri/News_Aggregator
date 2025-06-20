export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  sports: [
    "match",
    "tournament",
    "cricket",
    "football",
    "score",
    "goal",
    "NBA",
    "FIFA",
    "Olympics",
    "team",
    "points",
  ],
  technology: [
    "tech",
    "AI",
    "artificial intelligence",
    "software",
    "hardware",
    "gadget",
    "device",
    "robot",
    "startup",
    "cybersecurity",
  ],
  entertainment: [
    "movie",
    "music",
    "celebrity",
    "TV",
    "series",
    "Netflix",
    "Hollywood",
    "Bollywood",
    "film",
    "actor",
    "actress",
    "drama",
  ],
  business: [
    "stock",
    "market",
    "startup",
    "revenue",
    "investment",
    "finance",
    "IPO",
    "economy",
    "funding",
    "profit",
    "business",
    "dollar",
  ],
  trump: ["Trump"],
};

export const classifyMultipleCategories = (
  text: string,
  maxCount: number = 2
): string[] => {
  const lowerText = text.toLowerCase();
  const scoreMap: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchCount = keywords.filter((keyword) =>
      lowerText.includes(keyword.toLowerCase())
    ).length;
    console.log(matchCount);
    if (matchCount >= 1) {
      scoreMap[category] = matchCount;
    }
  }

  const sortedCategories = Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCount)
    .map(([category]) => category);

  console.log("Final matched categories:", sortedCategories);

  return sortedCategories.length > 0 ? sortedCategories : ["general"];
};
