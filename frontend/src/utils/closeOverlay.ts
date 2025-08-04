import React from "react";

export const handleOverlayClose = (
  event: React.MouseEvent<HTMLElement>,
  closeCallback: () => void
) => {
  const target = event.target as HTMLElement;
  if (target.id === "closeModal") {
    closeCallback();
  }
};
