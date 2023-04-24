export const onDragStart = (evt) => {
  let element = evt.currentTarget;
  element.classList.add("dragged");

  evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
  evt.dataTransfer.effectAllowed = "move";
};

export const onDragEnd = (evt) => {
  evt?.currentTarget?.classList?.remove("dragged");
};

export const onDragEnter = (evt) => {
  evt.preventDefault();
  let element = evt.currentTarget;
  element.classList.add("dragged-over");
  evt.dataTransfer.dropEffect = "move";
};

export const onDragLeave = (evt) => {
  let currentTarget = evt.currentTarget;
  let newTarget = evt.relatedTarget;
  if (newTarget.parentNode === currentTarget || newTarget === currentTarget)
    return;
  evt.preventDefault();
  let element = evt.currentTarget;
  element.classList.remove("dragged-over");
};

export const onDragOver = (evt) => {
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "move";
};
