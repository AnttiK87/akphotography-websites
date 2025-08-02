// Function to show the time since a given timestamp
// Shows when comment or reply were posted or edited
export const timeSince = (
  timestamp: Date,
  createdTimestamp: Date,
  language: "fin" | "eng"
): string => {
  //check if post is original or edited
  const edited: string =
    timestamp > createdTimestamp
      ? language === "fin"
        ? "muokattu"
        : "edited"
      : "";

  // change timestamp to Date object if it is not already
  // and calculate the difference in seconds
  const now: Date = new Date();
  const past: Date = new Date(timestamp);
  const diffInSeconds: number = Math.floor(
    (now.getTime() - past.getTime()) / 1000
  );

  // add editeed prefix if the post was edited
  const prefix = edited ? `${edited} ` : "";

  // return the time since the post was created or edited as s, min, h, day or week ago
  if (diffInSeconds < 60) {
    return `${prefix}${diffInSeconds} ${
      language === "fin" ? "s sitten" : "s ago"
    }`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${prefix}${minutes} ${
      language === "fin" ? "min sitten" : "min ago"
    }`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${prefix}${hours} ${language === "fin" ? "h sitten" : "h ago"}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${prefix}${days} ${language === "fin" ? "pvä sitten" : "days ago"}`;
  } else {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${prefix}${weeks} ${
      language === "fin" ? "vko sitten" : "weeks ago"
    }`;
  }
};
