import ScrollAnimations from './ScrollAnimations';

class Events {
	constructor() {
		this.init();
	}

	init() {
		const containers = document.querySelectorAll('[data-events]');
		if (!containers.length) {
			return;
		}

		containers.forEach((container) => {
			let page = Number(container.getAttribute('data-page'));

			if (!page) {
				return;
			}

			const button = container.nextElementSibling;
			const type = container.getAttribute('data-events');

			const fetchProjects = async () => {
				// Windows — ";", Linux — ":"
				const url = `${
					window.location.href.split('#')[0]
				}-${type}.json/page:${page}`;

				try {
					const response = await fetch(url);
					const { html, more } = await response.json();

					button.hidden = !more;
					container.insertAdjacentHTML('beforeend', html);
					page++;

					ScrollAnimations._initColoredImg();
				} catch (error) {
					console.log('Fetch error: ', error);
				}
			};

			button.addEventListener('click', fetchProjects);
		});
	}
}

export default new Events();
