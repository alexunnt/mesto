import Card from '../scripts/components/Card.js';
import Section from '../scripts/components/Section.js';
import popupWithImage from '../scripts/components/PopupWithImage.js';
import PopupWithForm from '../scripts/components/PopupWithForm.js';
import UserInfo from '../scripts/components/UserInfo.js';
import FormValidator from '../scripts/components/FormValidator.js';
import Api from '../scripts/components/Api.js';
import './index.css';

import {
    editButton,
    addButton,
    popupEditProfileSelector,
    formElementEditProfile,
    cardSelector,
    popupAddNewCardSelector,
    formElementAddNewCard,
    popupViewImageSelector,
    profileNameSelector,
    aboutProfileSelector,
    cardContainerSelector,
    nameInput,
    aboutInput,
    settings,
    options,
    profileAvatarSelector,
    popupDeleteCardSelector
} from '../scripts/utils/constants.js'
import PopupWithDelete from '../scripts/components/PopupWithDelete.js';

const popupViewImageClass = new popupWithImage(popupViewImageSelector);
popupViewImageClass.setEventListeners();

const userInfo = new UserInfo({ nameSelector: profileNameSelector, aboutSelector: aboutProfileSelector, avatarSelector: profileAvatarSelector });

const cardList = new Section({
    renderer: (item) => {
        cardList.setItem(createCard(item));
    }
}, cardContainerSelector);

let userId = null;

const api = new Api(options);
api.getUserInfo()
    .then(res => {
        // userInfo.setUserAvatar(res.avatar);
        userInfo.setUserInfo({
            name: res.name,
            about: res.about
        });
        userId = res._id;
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        api.getCards()
            .then(res => {
                cardList.renderItems(res);
            })
            .catch((error) => {
                console.log(error);
            })
    })

const initUserInfo = () => {
    const userData = userInfo.getUserInfo();
    nameInput.value = userData.name;
    aboutInput.value = userData.about;
}

const popupWithFormEdit = new PopupWithForm({
    popupSelector: popupEditProfileSelector,
    callbackSubmitForm: (data) => {
        api.setUserInfo(data)
            .then(res => {
                userInfo.setUserInfo({ name: res.name, about: res.about });
            })
            .catch((error) => {
                console.log(error);
            });
        popupWithFormEdit.close();
    }
});

popupWithFormEdit.setEventListeners();

const popupAddCard = new PopupWithForm({
    popupSelector: popupAddNewCardSelector,
    callbackSubmitForm: (data) => {
        api.addCard(data)
            .then(res => {
                cardList.setItem(createCard(res), 'prepend');
            })
            .catch((error) => {
                console.log(error);
            });
        popupAddCard.close();
    }
});

popupAddCard.setEventListeners();

const popupDeleteCard = new PopupWithDelete({
    popupSelector: popupDeleteCardSelector,
    callbackSubmitForm: () => {
        api.deleteCard(popupDeleteCard.card.id)
            .then(res => {
                popupDeleteCard.card.deleteCardHandler();
                popupDeleteCard.close();
            })
            .catch((error) => {
                console.log(error);
            })
    }
});

popupDeleteCard.setEventListeners();

const createCard = (item) => {
    const card = new Card(
        {
            data: item,
            handleCardClick: () => {
                popupViewImageClass.open(item.link, item.name)
            },
            handleCardDelete: () => {
                popupDeleteCard.open(card);
            },
            handleCardLike: () => {
                api.setLike(card.id)
                    .then(res => {
                        card.changeLikesCounter(res.likes.length);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },
            handleCardDeleteLike: () => {
                api.deleteLike(card.id)
                    .then(res => {
                        card.changeLikesCounter(res.likes.length);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },
            userIdCurrent: userId
        },
        cardSelector
    );

    return card.generateCard();
}

// активация валидации

const editProfileValidator = new FormValidator(settings, formElementEditProfile);

editProfileValidator.enableValidation();

const addNewCardValidator = new FormValidator(settings, formElementAddNewCard);

addNewCardValidator.enableValidation();

// слушатели для открытия попапов редактирования профиля и добавления новой карточки

editButton.addEventListener('click', () => {
    initUserInfo();
    editProfileValidator.toggleButtonState();
    editProfileValidator.hideErrors();
    popupWithFormEdit.open();
});

addButton.addEventListener('click', () => {
    addNewCardValidator.hideErrors();
    addNewCardValidator.toggleButtonState();
    popupAddCard.open();
})