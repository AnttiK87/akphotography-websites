import { useState } from "react";

import useNotLoggedin from "../../../hooks/useNotLoggedin.js";

import NotLoggedin from "../NotLoggedin.js";
import HandleHeroImages from "./HandleHeroImages.js";
import HandleContentPictures from "./HandleContentPictures.js";
import HandleCardPictures from "./HandleCardPictures.js";

import "./HandlingUiElements.css";

type View = {
  view: string;
  pathHero: string | undefined;
  pathContent: string | undefined;
  pathCard: string | undefined;
};

const HandlingUiElements = () => {
  const { user } = useNotLoggedin();

  const views: View[] = [
    {
      view: "home",
      pathHero: "/images/homeBackground/",
      pathContent: "/images/homepage/",
      pathCard: "/images/galleryCover/",
    },
    {
      view: "gallery",
      pathHero: undefined,
      pathContent: undefined,
      pathCard: undefined,
    },
    {
      view: "about",
      pathHero: "/images/about/",
      pathContent: "/images/aboutpage/",
      pathCard: undefined,
    },
    {
      view: "contact",
      pathHero: "/images/contact/",
      pathContent: undefined,
      pathCard: undefined,
    },
  ];

  const [selectedView, setSelectedView] = useState<View>(views[0]);

  if (!user) {
    return <NotLoggedin />;
  }

  return (
    <>
      <div className="containerOP">
        <h3>Edit ui elements</h3>
        <label className="labelSelect" htmlFor="view-select">
          Choose a view that you want to edit:
        </label>
        <select
          id="view-select"
          value={selectedView?.view ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            const found = views.find((x) => x.view === v);
            if (found) setSelectedView(found);
          }}
        >
          {views.map((view) => (
            <option key={view.view} value={view.view}>
              {view.view}
            </option>
          ))}
        </select>
        {selectedView && (
          <>
            <HandleHeroImages view={selectedView} />
            <HandleContentPictures view={selectedView} />
            <HandleCardPictures view={selectedView} />
          </>
        )}
      </div>
    </>
  );
};

export default HandlingUiElements;
