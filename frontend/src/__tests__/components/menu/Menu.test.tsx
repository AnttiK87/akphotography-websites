import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../test-utils/customRender";
import { describe, it, expect } from "vitest";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import Menu from "../../../components/menu/Menu";

type LanguageCode = "fin" | "eng";

interface LanguageLabels {
  home: string;
  pictures: string;
  info: string;
  contact: string;
  birds: string;
  mammals: string;
  nature: string;
  landscapes: string;
  monthly: string;
}

interface LanguageType {
  code: LanguageCode;
  labels: LanguageLabels;
}

const languages: LanguageType[] = [
  {
    code: "fin",
    labels: {
      home: "Koti",
      pictures: "Kuvat",
      info: "Kameran takana",
      contact: "Yhteystiedot",
      birds: "Linnut",
      mammals: "Nisäkkäät",
      nature: "Luonto",
      landscapes: "Maisemat",
      monthly: "Kuukauden kuva",
    },
  },
  {
    code: "eng",
    labels: {
      home: "Home",
      pictures: "Pictures",
      info: "About me",
      contact: "Contact",
      birds: "Birds",
      mammals: "Mammals",
      nature: "Nature",
      landscapes: "Landscapes",
      monthly: "Photo of the Month",
    },
  },
];

describe.each(languages)("menu language=%s", ({ code, labels }) => {
  it("renders menu link", () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <Menu />
      </LanguageProvider>
    );

    const homeLink = screen.getByRole("link", {
      name: new RegExp(labels.home, "i"),
    });
    expect(homeLink).toHaveAttribute("href", "/");

    const contactLink = screen.getByRole("link", {
      name: new RegExp(labels.contact, "i"),
    });
    expect(contactLink).toHaveAttribute("href", "/contact");

    const infoLink = screen.getByRole("link", {
      name: new RegExp(labels.info, "i"),
    });
    expect(infoLink).toHaveAttribute("href", "/info");
  });

  it("renders language dropdown links", () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <Menu />
      </LanguageProvider>
    );

    const dropDownToggle = screen.getByTestId("dropdown-menu-language");
    fireEvent.mouseEnter(dropDownToggle);

    const finnishLinks = screen.getAllByText(/Suomi/i);
    expect(finnishLinks.length).toBeGreaterThan(0);
    const englishLinks = screen.getAllByText(/English/i);
    expect(englishLinks.length).toBeGreaterThan(0);
  });

  it("renders gallery dropdown links", () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <Menu />
      </LanguageProvider>
    );

    const dropDownToggle = screen.getByTestId("dropdown-menu-pictures");
    fireEvent.mouseEnter(dropDownToggle);

    const mammalsLinks = screen.getAllByRole("link", {
      name: new RegExp(labels.mammals, "i"),
    });
    mammalsLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/pictures/mammals");
    });
    const birdsLinks = screen.getAllByRole("link", {
      name: new RegExp(labels.birds, "i"),
    });
    birdsLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/pictures/birds");
    });
    const natureLinks = screen.getAllByRole("link", {
      name: new RegExp(labels.nature, "i"),
    });
    natureLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/pictures/nature");
    });
    const landscapesLinks = screen.getAllByRole("link", {
      name: new RegExp(labels.landscapes, "i"),
    });
    landscapesLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/pictures/landscapes");
    });
    const monthlyLinks = screen.getAllByRole("link", {
      name: new RegExp(labels.monthly, "i"),
    });
    monthlyLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/pictures/monthly");
    });
  });
});
