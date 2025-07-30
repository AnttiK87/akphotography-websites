import { useAppSelector } from "../../hooks/useRedux.js";

import "./Notification.css";

const Notification = () => {
  const message = useAppSelector((state) => {
    return state.message;
  });

  if (message === null) {
    return null;
  }

  const notificationClass =
    message.type === "success"
      ? "notification success"
      : message.type === "error"
      ? "notification error"
      : "notification warning";

  return <div className={notificationClass}>{message.text}</div>;
};

export default Notification;
