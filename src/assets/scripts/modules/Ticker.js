const ClassName = {
	INITED: 'is-inited',
};

class Ticker {
	constructor() {
		window.addEventListener('load', () => {
			this.init();
		});
	}

	init() {
		this.containers = document.querySelectorAll('[data-ticker]');

		if (!this.containers.length) {
			return;
		}

		this.containers.forEach((container) => {
			do {
				Array.from(container.children).forEach((item) => {
					const clone = item.cloneNode(true);

					container.append(clone);
				});
			} while (container.scrollWidth < window.innerWidth * 2);

			container.style.setProperty(
				'--ticker-width',
				`${container.scrollWidth}px`
			);
			container.classList.add(ClassName.INITED);
		});

		window.addEventListener('resize', () => {
			this.containers.forEach((container) => {
				container.style.setProperty(
					'--ticker-width',
					`${container.scrollWidth}px`
				);
			});
		});
	}
}

export default new Ticker();
