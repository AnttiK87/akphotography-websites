import { useState } from "react";

const useToggleItem = () => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const closeItem = (componentClass: string) => {
    const components = document.querySelectorAll(componentClass);
    if (openItem === componentClass) {
      components.forEach((element) => {
        element.classList.remove("show");
        element.classList.add("collapsed");
      });
      setOpenItem(undefined);
    }
  };

  const toggleItem = (componentClass: string) => {
    const components = document.querySelectorAll(componentClass);

    if (openItem === componentClass) {
      components.forEach((element) => {
        element.classList.remove("show");
        element.classList.add("collapsed");
      });
      setOpenItem(undefined);
    } else {
      if (openItem) {
        document.querySelectorAll(openItem).forEach((el) => {
          el.classList.remove("show");
          el.classList.add("collapsed");
        });
      }

      components.forEach((element) => {
        element.classList.add("show");
        element.classList.remove("collapsed");
      });
      setOpenItem(componentClass);
    }
  };

  return { openItem, closeItem, toggleItem };
};

export default useToggleItem;
