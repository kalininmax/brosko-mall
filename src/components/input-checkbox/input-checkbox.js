const ClassName = {
	ERROR: '_error',
};

class Checkbox {
	constructor(input) {
		this.init(input);
	}

	init(container) {
		this.container = container;
		this.input = this.container.querySelector('input');

		this.input.addEventListener('change', () => {
			const isValid = this.input.checkValidity();

			if (isValid) {
				this.container.classList.remove(ClassName.ERROR);
			}
		});
	}
}

export default Checkbox;
