import gsap from 'gsap';
import Popups from '../popups/popups';

const ClassName = {
	FILLED: '_filled',
	ERROR: '_error',
};

class Form {
	constructor(form) {
		this.init(form);
	}

	init(form) {
		this.form = form;

		if (!this.form) {
			return;
		}

		this.submitButton = this.form.querySelector('[type="submit"]');
		this.requiredInputs = this.form.querySelectorAll('[required]');
		this.isFormValid = false;

		this._updateSubmitBtnState();

		this.form.addEventListener('submit', (evt) => {
			evt.preventDefault();

			Popups.close();
			this.showSuccessPopup();
		});

		this.requiredInputs.forEach((input) => {
			input.addEventListener('change', () => {
				this._updateSubmitBtnState();
			});
			if (input.type === 'file') {
				input.addEventListener('input', () => {
					this._updateSubmitBtnState();
				});
			}
		});
	}
	_checkFormValidity() {
		this.requiredInputs.forEach((input) => {
			if (input.type === 'file') {
				input.isValid = false;
				const inputContainer = input.closest('[data-input]');

				if (inputContainer.classList.contains(ClassName.FILLED)) {
					input.isValid = true;
				}
			} else {
				input.isValid = input.checkValidity();
			}
		});

		return Array.from(this.requiredInputs).every((input) => input.isValid);
	}
	_updateSubmitBtnState() {
		this.isFormValid = this._checkFormValidity();
		!this.isFormValid
			? this.submitButton.setAttribute('disabled', true)
			: this.submitButton.removeAttribute('disabled');
	}
	showSuccessPopup() {
		this.successPopup = document.querySelector('[data-notification]');

		gsap.fromTo(
			this.successPopup,
			{ y: 50, autoAlpha: 0 },
			{
				y: 0,
				autoAlpha: 1,
				duration: 0.3,
				delay: 0.15,
			}
		);
		gsap.fromTo(
			this.successPopup,
			{
				y: 0,
				autoAlpha: 1,
			},
			{
				y: 50,
				autoAlpha: 0,
				duration: 0.3,
				delay: 5,
				immediateRender: false,
			}
		);
	}
}

export default Form;
