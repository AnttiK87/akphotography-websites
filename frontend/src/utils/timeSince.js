export const timeSince = (timestamp, cratedTimestamp, language) => {
  const edited =
    timestamp > cratedTimestamp
      ? language === "fin"
        ? "muokattu"
        : "edited"
      : "";
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return `${edited != "" ? edited : ""} ${diffInSeconds} ${
      language === "fin" ? "s sitten" : "s ago"
    }`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${edited != "" ? edited : ""} ${minutes}  ${
      language === "fin" ? "min sitten" : "min ago"
    }`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${edited != "" ? edited : ""} ${hours} ${
      language === "fin" ? "h sitten" : "h ago"
    }`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${edited != "" ? edited : ""} ${days} ${
      language === "fin" ? "pvä sitten" : "days ago"
    }`;
  } else {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${edited != "" ? edited : ""} ${weeks} ${
      language === "fin" ? "vko sitten" : "weeks ago"
    }`;
  }
};
