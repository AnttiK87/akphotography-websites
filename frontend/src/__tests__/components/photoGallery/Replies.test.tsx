vi.mock("../../../hooks/useLightBox", () => {
  return {
    default: () => ({
      currentComment: {
        id: 2,
        reply: "orginal reply",
        commentId: 10,
        pictureId: 1,
        userId: "mock-user-id",
        username: "test user",
        adminReply: false,
        parentReplyId: null,
        parentReply: null,
        createdAt: "2025-08-19T07:25:35.904Z",
        updatedAt: "2025-08-19T07:25:35.904Z",
        comment: {
          id: 10,
          comment: "Orginal comment",
          username: "test user",
          userId: "mock-user-id",
          pictureId: 1,
          createdAt: "2025-08-19T07:25:35.904Z",
          updatedAt: "2025-08-19T07:25:35.904Z",
        },
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
import { createReply, editReply } from "../../../reducers/replyReducer.js";
import { languages } from "../../test-utils/languages";

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
    editReply: vi.fn((commentId, userId, formData, language) => ({
      type: "EDIT_REPLY",
      payload: commentId,
      userId,
      formData,
      language,
    })),
  };
});

describe.each(languages)("CommentForm language=%s", ({ code, labels }) => {
  afterAll(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("renders reply form labels correctly", () => {
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

    const header = screen.getByRole("heading", { level: 3 });
    expect(header).toHaveTextContent(labels.header3);
    expect(screen.getByLabelText(labels.reply)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: labels.submit3 })
    ).toBeInTheDocument();
  });

  it("Calls createReply for reply on form submission with correct data", async () => {
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
        commentId: 10,
        userId: "mock-user-id",
        pictureId: 1,
        parentReplyId: 2,
        adminReply: false,
      },
      code
    );
  });

  it("Calls editReply on form submission with correct data", async () => {
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

    await userEvent.type(screen.getByLabelText(labels.username), " edited");
    await userEvent.type(screen.getByLabelText(labels.comment), " edited");

    await userEvent.click(screen.getByRole("button", { name: labels.submit2 }));

    expect(editReply).toHaveBeenCalledWith(
      {
        commentId: 2,
        userId: "mock-user-id",
        formData: {
          reply: "orginal reply edited",
          username: "test user edited",
        },
      },
      code
    );
  });
});
