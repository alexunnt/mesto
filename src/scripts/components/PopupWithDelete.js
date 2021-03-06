import Popup from "./Popup.js";

export default class PopupWithDelete extends Popup {
    constructor({ popupSelector, callbackSubmitForm }) {
        super(popupSelector);
        this._callbackSubmitForm = callbackSubmitForm;
        this._formElement = this._popup.querySelector('.popup-form');
        this._formButton = this._formElement.querySelector('.popup-form__button');
        this._formButtonText = this._formButton.textContent;
    }

    open(card) {
        this.card = card;
        super.open();
    }

    loader(status) {
        if (status) {
            this._formButton.textContent = 'Удаление...';
        } else this._formButton.textContent = this._formButtonText;
    }

    setEventListeners() {
        super.setEventListeners();
        this._formElement.addEventListener('submit', (evt) => this._callbackSubmitForm(evt));
    }
}