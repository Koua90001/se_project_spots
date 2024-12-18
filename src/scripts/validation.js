export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error"
};


const showInputError = (formEl, inputElement, errorMsg, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorMsgEl.textContent = errorMsg;
  errorMsgEl.classList.add(config.errorClass);

}
const hideInputError = (formEl, inputElement, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputElement.id}-error`);
  errorMsgEl.textContent = "";
  inputElement.classList.remove(config.inputErrorClass);


};

const checkInputValidity = (formEl, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(formEl, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formEl, inputElement, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);

  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};
export const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};
export const resetValidation = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  inputList.forEach((input) => {
    hideInputError(formEl, input, config);
  });
};

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};


export const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);

  });
};
enableValidation(validationConfig);