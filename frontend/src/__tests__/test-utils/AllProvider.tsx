import type { ReactNode } from "react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../../reducers/store";
import { LanguageProvider } from "../../contexts/LanguageContext";
import { LightBoxProvider } from "../../contexts/LightBoxContext";
import { ImageIndexProvider } from "../../contexts/ImageIndexContext";

type AllProvidersProps = {
  children: ReactNode;
  initialEntries?: string[];
};

export const AllProviders = ({
  children,
  initialEntries = ["/"],
}: AllProvidersProps) => {
  return (
    <LanguageProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <LightBoxProvider>
            <ImageIndexProvider>{children}</ImageIndexProvider>
          </LightBoxProvider>
        </MemoryRouter>
      </Provider>
    </LanguageProvider>
  );
};
