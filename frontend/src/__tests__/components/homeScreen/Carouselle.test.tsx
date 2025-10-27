import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../test-utils/customRender";
import { describe, it, vi, beforeEach, expect } from "vitest";
import Carouselle from "../../../components/homeScreen/Carouselle";
import type { ReactNode } from "react";

vi.mock("axios", () => {
  return {
    default: {
      get: vi.fn().mockResolvedValue({
        data: [
          { id: 1, urlThumbnail: "thumb1.jpg" },
          { id: 2, urlThumbnail: "thumb2.jpg" },
        ],
      }),
    },
  };
});

const openLightBox = vi.fn();
const setCategory = vi.fn();
vi.mock("../../../hooks/useLightBox", () => ({
  default: () => ({ openLightBox, setCategory }),
}));

vi.mock("react-slick", () => {
  return {
    default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

describe("Carouselle component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState = vi.fn();
  });

  it("renders loading state initially", () => {
    render(<Carouselle category="monthly" />);
    expect(screen.getByText(/Ladataan...|Loading.../i)).toBeInTheDocument();
  });

  it("renders error state", async () => {
    const axios = (await import("axios")).default;
    (
      axios.get as unknown as {
        mockRejectedValueOnce: (error: unknown) => void;
      }
    ).mockRejectedValueOnce(new Error("Network Error"));

    render(<Carouselle category="monthly" />);

    const errorMessage = await screen.findByText(
      /Virhe ladattaessa kuvia|Error loading pictures/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders pictures and handles click", async () => {
    render(<Carouselle category="monthly" />);

    const img = await screen.findByAltText("picture id: 1");
    expect(img).toBeInTheDocument();

    fireEvent.click(img);

    expect(openLightBox).toHaveBeenCalledWith(0);
    expect(setCategory).toHaveBeenCalledWith("monthly");
    expect(window.history.pushState).toHaveBeenCalled();
  });
});
