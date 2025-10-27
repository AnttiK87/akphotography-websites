vi.mock("../../../hooks/useLightBox", () => {
  return {
    default: () => ({
      currentComment: {
        id: 2,
        comment: "test comment",
        username: "test user",
        userId: "mock-user-id",
        pictureId: 1,
        createdAt: "2025-08-19T07:25:35.904Z",
        updatedAt: "2025-08-19T07:25:35.904Z",
      },
    }),
  };
});

vi.mock("../../../utils/createAndGetUserId", () => ({
  getUserId: vi.fn(() => "mock-user-id"),
}));

import { screen } from "@testing-library/react";
import { render } from "../../test-utils/customRender.js";
import { describe, it, expect, vi, afterAll } from "vitest";
import userEvent from "@testing-library/user-event";
import CommentForm from "../../../components/photoGallery/CommentForm.js";
import { LanguageProvider } from "../../../contexts/LanguageContext.js";
import {
  createComment,
  editComment,
} from "../../../reducers/commentReducer.js";
import { createReply } from "../../../reducers/replyReducer.js";
import { languages } from "../../test-utils/languages";

vi.mock("../../../reducers/commentReducer", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("../../../reducers/commentReducer.js")
  >();
  return {
    ...actual,
    createComment: vi.fn((formData, language) => ({
      type: "CREATE_COMMENT",
      payload: formData,
      language,
    })),
    editComment: vi.fn((commentId, userId, formData, language) => ({
      type: "EDIT_COMMENT",
      payload: commentId,
      userId,
      formData,
      language,
    })),
  };
});

vi.mock("../../../reducers/replyReducer", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("../../../reducers/replyReducer.js")
  >();
  return {
    ...actual,
    createReply: vi.fn((formData, language) => ({
      type: "CREATE_REPLY",
      payload: formData,
      language,
    })),
  };
});

describe.each(languages)("CommentForm language=%s", ({ code, labels }) => {
  afterAll(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("renders comment form labels correctly", () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <CommentForm
          show={true}
          setShow={vi.fn()}
          pictureId={1}
          edit={false}
          setEdit={vi.fn()}
          reply={false}
          setReply={vi.fn()}
          adminComment={false}
        />
      </LanguageProvider>
    );

    const header = screen.getByRole("heading", { level: 3 });
    expect(header).toHaveTextContent(labels.header);
    expect(screen.getByLabelText(labels.username)).toBeInTheDocument();
    expect(screen.getByLabelText(labels.comment)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: labels.submit })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: labels.clear })
    ).toBeInTheDocument();
  });

  it("Button resets form data", async () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <CommentForm
          show={true}
          setShow={vi.fn()}
          pictureId={1}
          edit={false}
          setEdit={vi.fn()}
          reply={false}
          setReply={vi.fn()}
          adminComment={false}
        />
      </LanguageProvider>
    );

    const usernameInput = screen.getByLabelText(labels.username);
    const commentInput = screen.getByLabelText(labels.comment);

    await userEvent.type(usernameInput, "Test User");
    await userEvent.type(commentInput, "Test comment");

    await userEvent.click(screen.getByRole("button", { name: labels.clear }));

    expect(usernameInput.getAttribute("value")).toBe("");
    expect(commentInput.getAttribute("value")).toBe(null);
  });

  it("Calls createComment on form submission with correct data", async () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <CommentForm
          show={true}
          setShow={vi.fn()}
          pictureId={1}
          edit={false}
          setEdit={vi.fn()}
          reply={false}
          setReply={vi.fn()}
          adminComment={false}
        />
      </LanguageProvider>
    );

    await userEvent.type(screen.getByLabelText(labels.username), "Test User");
    await userEvent.type(screen.getByLabelText(labels.comment), "Test comment");

    await userEvent.click(screen.getByRole("button", { name: labels.submit }));

    expect(createComment).toHaveBeenCalledWith(
      {
        comment: "Test comment",
        username: "Test User",
        pictureId: 1,
        userId: "mock-user-id",
      },
      code
    );
  });

  it("Calls createReply for comment on form submission with correct data", async () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <CommentForm
          show={true}
          setShow={vi.fn()}
          pictureId={1}
          edit={false}
          setEdit={vi.fn()}
          reply={true}
          setReply={vi.fn()}
          adminComment={false}
        />
      </LanguageProvider>
    );

    await userEvent.type(screen.getByLabelText(labels.username), "Test User");
    await userEvent.type(screen.getByLabelText(labels.reply), "Test reply");

    await userEvent.click(screen.getByRole("button", { name: labels.submit3 }));

    expect(createReply).toHaveBeenCalledWith(
      {
        reply: "Test reply",
        username: "Test User",
        commentId: 2,
        userId: "mock-user-id",
        pictureId: 1,
        parentReplyId: null,
        adminReply: false,
      },
      code
    );
  });

  it("renders edit comment forms labels correctly", () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <CommentForm
          show={true}
          setShow={vi.fn()}
          pictureId={1}
          edit={true}
          setEdit={vi.fn()}
          reply={false}
          setReply={vi.fn()}
          adminComment={false}
        />
      </LanguageProvider>
    );

    const header = screen.getByRole("heading", { level: 3 });
    expect(header).toHaveTextContent(labels.header2);
    expect(
      screen.getByRole("button", { name: labels.submit2 })
    ).toBeInTheDocument();
  });

  it("Calls editComment on form submission with correct data", async () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <CommentForm
          show={true}
          setShow={vi.fn()}
          pictureId={1}
          edit={true}
          setEdit={vi.fn()}
          reply={false}
          setReply={vi.fn()}
          adminComment={false}
        />
      </LanguageProvider>
    );

    const usernameInput = screen.getByLabelText(labels.username);
    const commentInput = screen.getByLabelText(labels.comment);

    await userEvent.type(usernameInput, " edited");
    await userEvent.type(commentInput, " edited");

    await userEvent.click(screen.getByRole("button", { name: labels.submit2 }));

    expect(editComment).toHaveBeenCalledWith(
      {
        commentId: 2,
        userId: "mock-user-id",
        formData: {
          comment: "test comment edited",
          username: "test user edited",
        },
      },
      code
    );
  });
});
