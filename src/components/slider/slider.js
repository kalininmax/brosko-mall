import Swiper, { Autoplay, Pagination, Navigation } from 'swiper';

class Slider {
	constructor() {
		document
			.querySelectorAll('[data-slider]')
			.forEach((slider) => this.init(slider));
	}

	init(container) {
		const hasAutoplay = container.hasAttribute('data-slider-autoplay');
		const hasPagination = container.hasAttribute('data-slider-pagination');
		const hasNavigation = container.hasAttribute('data-slider-navigation');
		const modules = [];
		const autoplayOptions = {};
		const paginationOptions = {};
		const navigationOptions = {};

		if (hasPagination) {
			const paginationType = container.getAttribute('data-slider-pagination');

			paginationOptions.clickable = true;
			paginationOptions.el = container.querySelector('.swiper-pagination');
			paginationOptions.type = paginationType || 'bullets';

			modules.push(Pagination);
		}
		if (hasAutoplay) {
			hasAutoplay && modules.push(Autoplay);
			autoplayOptions.delay = 2000;
		}

		if (hasNavigation) {
			navigationOptions.nextEl = container.querySelector('.swiper-button-next');
			navigationOptions.prevEl = container.querySelector('.swiper-button-prev');

			modules.push(Navigation);
		}

		new Swiper(container, {
			modules: modules,
			loop: true,
			pagination: paginationOptions,
			autoplay: autoplayOptions,
			navigation: navigationOptions,
		});
	}
}

export default new Slider();
