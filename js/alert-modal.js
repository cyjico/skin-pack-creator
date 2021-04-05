function alertModal(message = "") {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modal.appendChild(modalContent);

  const header = document.createElement("h3");
  header.innerText = message;
  modalContent.appendChild(header);

  const button = document.createElement("button");
  button.innerText = "X";
  button.classList.add("modal-close");
  header.appendChild(button);

  button.addEventListener("click", () => {
    modal.remove();
  });
  modal.addEventListener("click", (ev) => {
    if (ev.target === modal) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}

export default alertModal;
