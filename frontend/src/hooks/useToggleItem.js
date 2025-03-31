import { useState } from "react";

const useToggleItem = () => {
  const [openItem, setOpenItem] = useState(null);

  const closeItem = (componentClass) => {
    const components = document.querySelectorAll(componentClass);
    if (openItem === componentClass) {
      components.forEach((element) => {
        element.classList.remove("show");
        element.classList.add("collapsed");
      });
      setOpenItem(null);
    }
  };

  const toggleItem = (componentClass) => {
    const components = document.querySelectorAll(componentClass);

    if (openItem === componentClass) {
      components.forEach((element) => {
        element.classList.remove("show");
        element.classList.add("collapsed");
      });
      setOpenItem(null);
    } else {
      if (openItem) {
        document.querySelectorAll(openItem).forEach((el) => {
          el.classList.remove("show");
          el.classList.add("collapsed");
        });
      }

      // Avaa uusi elementti
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
