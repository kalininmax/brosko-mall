import IMask from 'imask';

const BYTES_IN_MB = 1048576;
const ClassName = {
	FILLED: '_filled',
	ERROR: '_error',
	DRAGENTER: '_dragenter',
};

class Input {
	constructor(input) {
		this.init(input);
	}

	init(container) {
		this.container = container;

		if (!this.container) {
			return;
		}

		container.input = this;

		this.input = this.container.querySelector('.input__input');
		this.resetButton = this.container.querySelector('.input__reset-btn');

		this._onInputInput = this._onInputInput.bind(this);
		this._onInputChange = this._onInputChange.bind(this);
		this._onResetButtonClick = this._onResetButtonClick.bind(this);
		this.reset = this.reset.bind(this);

		this.input.addEventListener('input', this._onInputInput);
		this.input.addEventListener('change', this._onInputChange);
		this.resetButton &&
			this.resetButton.addEventListener('click', this._onResetButtonClick);

		this._initFileInput();

		if (this.input.getAttribute('inputmode') === 'tel') {
			IMask(this.input, { mask: Number, scale: 0 });
		}
	}
	_initFileInput() {
		if (this.input.type === 'file') {
			this.fileNameElement = this.container.querySelector('.input__file-name');
			this.fileNameTextElement = this.container.querySelector(
				'.input__file-name-text'
			);

			this.input.addEventListener('dragenter', () => {
				this.container.classList.add(ClassName.DRAGENTER);
			});

			this.input.addEventListener('dragleave', () => {
				this.container.classList.remove(ClassName.DRAGENTER);
			});

			this.input.addEventListener('drop', (evt) => {
				this.fileInstance = evt.dataTransfer.files[0];

				if (this.fileInstance.size > 10 * BYTES_IN_MB) {
					this.container.classList.add(ClassName.ERROR);
				}
			});
		}
	}
	_onInputInput(evt) {
		const input = evt.currentTarget;
		const isValid = input.checkValidity();

		if (input.value) {
			this.container.classList.add(ClassName.FILLED);
		} else {
			this.container.classList.remove(ClassName.FILLED);
		}

		if (isValid) {
			this.container.classList.remove(ClassName.ERROR);
		}
	}
	_onInputChange(evt) {
		const input = evt.currentTarget;
		let isValid = input.checkValidity();

		if (this.input.type === 'file') {
			this.container.classList.remove(ClassName.DRAGENTER);
			this.fileResetBtn && this.fileResetBtn.remove();

			this.fileInstance = input.files[0];
			if (this.fileInstance && this.fileInstance.size > 10 * BYTES_IN_MB) {
				isValid = false;
				this.container.classList.remove(ClassName.FILLED);
			}
		}

		if (isValid) {
			this.container.classList.remove(ClassName.ERROR);

			if (this.input.type === 'file') {
				this.fileNameTextElement.textContent = this.fileInstance.name;
				this.fileResetBtn = document.createElement('span');
				this.fileResetBtn.classList.add('input__reset-btn');
				this.fileResetBtn.textContent = 'Удалить';
				this.fileNameElement.append(this.fileResetBtn);
				this.fileResetBtn.addEventListener('click', () => {
					this.reset();
					isValid = false;
				});
			}
		} else {
			this.container.classList.add(ClassName.ERROR);
			input.reportValidity();

			if (this.input.type === 'file') {
				this.fileNameTextElement.textContent = '';
			}
		}
	}
	_onResetButtonClick(evt) {
		evt.preventDefault();

		this.reset();
	}
	reset() {
		if (this.input.type === 'file') {
			this.input.type = '';
			this.input.type = 'file';
			this.fileNameTextElement.textContent = '';
		}

		this.container.classList.remove(ClassName.FILLED);
		this.input.dispatchEvent(new Event('input', { bubbles: true }));
	}
}

export default Input;
