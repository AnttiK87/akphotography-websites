import { showMessage } from "../reducers/messageReducer";
import { clearUser } from "../reducers/userReducer";

export const handleError = (error, dispatch, navigate, language = "en") => {
  const status = error.response?.status;
  const data = error.response?.data;

  const getLocalizedMessage = () => {
    if (data?.messages) {
      return data.messages[language] || data.messages.en || data.messages.fi;
    }
    if (data?.message) {
      return data.message;
    }
    if (data?.error) {
      return data.error;
    }
    return error.message || "An error occurred.";
  };

  if (status === 400 && Array.isArray(data?.details)) {
    const fieldErrors = data.details
      .map((e) => `${e.field}: ${e.message}`)
      .join("\n");

    dispatch(
      showMessage(
        {
          text: fieldErrors,
          type: "error",
        },
        5
      )
    );
    return;
  }

  if (status === 401) {
    localStorage.removeItem("loggedAdminUser");
    dispatch(clearUser());
    dispatch(
      showMessage(
        {
          text:
            language === "fi"
              ? "Istuntosi on vanhentunut. Kirjaudu uudelleen."
              : "Your session has expired. Please log in again.",
          type: "error",
        },
        3
      )
    );
    if (navigate) {
      navigate("/admin");
    }
  } else {
    dispatch(
      showMessage(
        {
          text: getLocalizedMessage(),
          type: "error",
        },
        3
      )
    );
  }
};
