import { render as rtlRender } from "@testing-library/react";
import type { ReactElement } from "react";
import { AllProviders } from "./AllProvider";

// custom render joka kietoo kaikki providerit ympärille
const customRender = (ui: ReactElement, options = {}) =>
  rtlRender(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
