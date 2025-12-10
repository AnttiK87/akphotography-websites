//dependencies
import { useState, useMemo, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux.js";
import {
  selectLanguages,
  makeSelectTexts,
} from "../../../reducers/selectors/uiTexts.js";
import { editUiText } from "../../../reducers/uiTextsReducer.js";
import { showMessage } from "../../../reducers/messageReducer.js";

import type { UiText } from "../../../types/uiTextTypes.js";

import "./HandleHeroImages.css";
import "./HandleTexts.css";

type HHandleTextsProps = {
  view: {
    view: string;
    pathHero: string | undefined;
    pathContent: string | undefined;
    pathCard: string | undefined;
  };
};

const HandleTexts = ({ view }: HHandleTextsProps) => {
  const dispatch = useAppDispatch();

  const languages = useAppSelector(selectLanguages);
  const [lang, setLang] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [newType, setNewType] = useState<string | undefined>(undefined);
  const types = ["Title", "Text", "Other"];

  const selectTexts = useMemo(
    () => makeSelectTexts(view.view, lang, type),

    [view.view, lang, type]
  );

  const filteredTexts = useAppSelector(selectTexts);

  const [selectedText, setSelectedText] = useState<UiText | undefined>(
    undefined
  );
  const [editedText, setEditedText] = useState<string | undefined>(undefined);

  useEffect(() => {
    clear();
  }, [view]);

  const submit = async (
    id: number | undefined,
    content: string | undefined,
    role: string | undefined
  ) => {
    if (id === undefined || content === undefined || role === undefined) {
      dispatch(
        showMessage(
          {
            text: "Undefined content!",
            type: "error",
          },
          5
        )
      );

      return;
    }
    await dispatch(editUiText({ id, content, role }));

    setSelectedText(undefined);
    setEditedText(undefined);
  };

  const clear = () => {
    setLang(undefined);
    setType(undefined);
    setSelectedText(undefined);
    setEditedText(undefined);
  };

  return (
    <>
      <div className="handle-hero">
        <h4>Change texts on {view.view} screen</h4>
        <label className="labelSelect" htmlFor="view-select">
          Select the text to edit:
        </label>

        <select
          className="select-text"
          id="language-select"
          value={lang ?? ""}
          onChange={(e) => {
            setLang(e.target.value);
            setSelectedText(undefined);
            setEditedText(undefined);
          }}
        >
          <option value="">Choose language</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
        <select
          className="select-text"
          id="text-select"
          value={type ?? ""}
          disabled={!lang}
          onChange={(e) => {
            setType(e.target.value === "" ? undefined : e.target.value);
            setSelectedText(undefined);
            setEditedText(undefined);
          }}
        >
          <option value={""}>Filter by type</option>
          {types.map((type) => (
            <option
              key={type}
              value={type === "Other" ? "all" : type.toLowerCase()}
            >
              {type}
            </option>
          ))}
        </select>
        <select
          className="select-text"
          id="text-select"
          value={selectedText?.key_name ?? ""}
          disabled={!lang || filteredTexts.length === 0}
          onChange={(e) => {
            const v = e.target.value;
            const found = filteredTexts.find((x) => x.key_name === v);
            if (found) {
              setSelectedText(found);
              setEditedText(found.content);
              setNewType(found.role);
            }
          }}
        >
          <option value="">
            {!lang
              ? "Choose text"
              : filteredTexts.length === 0
              ? "No texts to show"
              : "Choose text"}
          </option>
          {filteredTexts.map((text) => (
            <option key={text.key_name} value={text.key_name}>
              {text.key_name} {text.language}
            </option>
          ))}
        </select>
        <div className="textFieldContainer">
          <div className="field-button">
            <label htmlFor="selectedText">Change selected text:</label>

            {selectedText && selectedText.role === "text" ? (
              <textarea
                name="text"
                id="selectedText"
                value={editedText ?? ""}
                placeholder="Change selected text"
                rows={10}
                onChange={(e) => setEditedText(e.target.value)}
              />
            ) : (
              <input
                className="textField no-margin"
                value={editedText ?? ""}
                type="text"
                id="selectedText"
                name="selectedText"
                placeholder="Change selected text"
                disabled={!selectedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            )}

            <select
              className="select-text"
              id="new-type-select"
              disabled={!selectedText}
              value={newType ? (newType === "all" ? "other" : newType) : ""}
              onChange={(e) => {
                setNewType(e.target.value);
              }}
            >
              <option value={undefined}>Change type</option>
              {types.map((type) => (
                <option
                  key={type}
                  value={type === "other" ? "all" : type.toLowerCase()}
                >
                  {type}
                </option>
              ))}
            </select>
            <div>
              <button
                className="button-primary  delButton"
                type="button"
                onClick={clear}
              >
                Clear All
              </button>
              <button
                className="button-primary no-margin"
                type="button"
                onClick={() => submit(selectedText?.id, editedText, newType)}
              >
                Save Edits
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HandleTexts;
