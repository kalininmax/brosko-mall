import Swiper from 'swiper';

class Gallery {
	constructor() {
		document
			.querySelectorAll('[data-gallery]')
			.forEach((container) => this.init(container));
	}

	init(container) {
		new Swiper(container, {
			loop: true,
			slidesPerView: 'auto',
			spaceBetween: 5,
		});
	}
}

export default new Gallery();
