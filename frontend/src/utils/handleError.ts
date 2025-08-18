import { isAxiosError } from "axios";
import { showMessage } from "../reducers/messageReducer";
import { clearUser } from "../reducers/userReducer";

import type { AppDispatch } from "../reducers/store";
import type { NavigateFunction } from "react-router-dom";
import type { Language } from "../types/types";

export const handleError = (
  error: unknown,
  dispatch: AppDispatch,
  navigate?: NavigateFunction,
  language: Language = "eng"
): void => {
  if (!isAxiosError(error)) {
    console.error("Unknown error:", error);
    dispatch(
      showMessage(
        {
          text:
            language === "fin"
              ? "Tuntematon virhe tapahtui."
              : "An unknown error occurred.",
          type: "error",
        },
        3
      )
    );
    return;
  }

  const status = error.response?.status;
  const data = error.response?.data;

  console.error("Axios error occurred:", error);

  const getLocalizedMessage = (): string => {
    if (Array.isArray(data?.messages)) {
      return data.messages
        .map(
          (msg: { field: string; message: string }) =>
            `${msg.field}: ${msg.message}`
        )
        .join("\n");
    }
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
      .map(
        (e: { field: string; message: string }) => `${e.field}: ${e.message}`
      )
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
  if (status === 401 && data.messages.en === "invalid username or password") {
    localStorage.removeItem("loggedAdminUser");
    dispatch(clearUser());
    dispatch(
      showMessage(
        {
          text:
            language === "fin"
              ? "Väärä käyttäjätunnus tai salasana."
              : "Wrong username or password.",
          type: "error",
        },
        3
      )
    );
  } else if (status === 401) {
    localStorage.removeItem("loggedAdminUser");
    dispatch(clearUser());
    dispatch(
      showMessage(
        {
          text:
            language === "fin"
              ? "Kirjaudu uudelleen sisään."
              : "Please log in again.",
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
