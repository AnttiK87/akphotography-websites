//Notification component for rendering notifications to users
import { useSelector } from "react-redux";

import "./Notification.css";

const Notification = () => {
  const message = useSelector((state) => {
    return state.message;
  });

  if (message === null) {
    return null;
  }

  const notificationClass =
    message.type === "success" ? "notification success" : "notification error";

  return <div className={notificationClass}>{message.text}</div>;
};

export default Notification;
