//Notification component for rendering notifications to user
//dependencies
import { useSelector } from "react-redux";

import "./Notification.css";

const Notification = () => {
  //get message state
  const message = useSelector((state) => {
    //console.log(state.message)
    return state.message;
  });

  //notification is not shown if there is no message
  if (message === null) {
    return null;
  }

  //determinen style of notification according to notification type
  const notificationClass =
    message.type === "success" ? "notification success" : "notification error";

  //render notification
  return <div className={notificationClass}>{message.text}</div>;
};

//export
export default Notification;
