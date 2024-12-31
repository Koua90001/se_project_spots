import "./index.css";
import { enableValidation, validationConfig, resetValidation, disableButton } from "../scripts/validation.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];
let selectedCard, selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a8969887-c598-4af8-b0fe-e88b1bb964df",
    "Content-Type": "application/json",
  },
});

api
.getAppInfo()
.then(([cards, users]) => {
  cards.forEach((item) => {
    const cardElement = getCardElement(item);
    cardsList.append(cardElement);
  });

  avatarForm.src = users.avatar;
  profileName.textContent = users.name;
  profileDescription.textContent = users.about;
})
.catch(console.error);


//Profile elements
const profileImage  = document.querySelector(".profile__avatar");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//Form elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//avatar elements

const avatarModal = document.querySelector("#avatar-modal")
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn")
const avatarForm  = avatarModal.querySelector('.modal__form')
const avatarSubmitButton = avatarModal.querySelector('.modal__submit-btn')
const avatarInput = avatarModal.querySelector('#profile-avatar-input')

//delete form elements

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancelButton = deleteModal.querySelector(
  ".modal__submit-btn_type_cancel"
);


//cards elements

const addCardModal = document.querySelector("#add-card-modal");
const cardForm = addCardModal.querySelector(".modal__form");
const cardSubmitButton = addCardModal.querySelector(".modal__submit-btn");
const addCardclosebtn = addCardModal.querySelector(".modal__close-btn");
const cardNameInput = addCardModal.querySelector("#add-card-name-input");
const cardLinkInput = addCardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

//card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");




function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardNameEl.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id));

  cardImage.addEventListener("click", () => handleImageClick(data));

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("mousedown", closeModalByOverlay);
  document.addEventListener("keydown", closeModalEscape);
}
function closeModal(modal) {
  if (modal) {
    modal.classList.remove("modal_opened");
    modal.removeEventListener("mousedown", closeModalByOverlay);
    document.removeEventListener("keydown", closeModalEscape);
  }
}

function closeModalByOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function closeModalEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
  .editUserInfo({ name: nameInput.value,
    about: descriptionInput.value,
  })
  .then((userData) => {

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    closeModal(editModal);
  })
  .catch(console.error);

}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  disableButton(cardSubmitButton, validationConfig);
  closeModal(addCardModal);
}


function handleAvatarSubmit(evt)  {
  evt.preventDefault();
    api.editAvatarInfo(avatarInput.value).then((avatarData) => {
      profileImage.src = avatarData.avatar;
      disableButton(avatarSubmitButton, validationConfig);
      closeModal(avatarModal);

    });


}

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
    api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      closeModal(deleteModal);

    });

}


function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  const cardLikeBtn = evt.target;
  const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");

  api
    .changeLikeStatus(id, isLiked)
    .then((isLiked) => {
      if (isLiked) {
        isLiked = true;
        cardLikeBtn.classList.toggle("card__like-btn_liked");
      } else {
        isLiked = false;
        cardLikeBtn.classList.toggle("card__like-btn_liked");
      }
    })
    .catch(console.error);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, validationConfig);
  openModal(editModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);



const addCardButton = document.querySelector(".profile__add-btn");

addCardButton.addEventListener("click", () => {
  openModal(addCardModal);
});

cardForm.addEventListener("submit", handleAddCardSubmit);

deleteForm.addEventListener("submit", handleDeleteCardSubmit);

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit)


const closeModalBtns = document.querySelectorAll(".modal__close-btn");

closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    closeModal(modal);
  });
});

enableValidation(validationConfig);