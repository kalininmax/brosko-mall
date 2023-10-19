import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper, { Navigation, EffectCards } from 'swiper';

const ClassName = {
	ACTIVE: '_active',
};

class Features {
	constructor() {
		this.init();
	}

	init() {
		this.container = document.querySelector('[data-features]');

		if (!this.container) {
			return;
		}

		this._initScrollAnim();
		this._initGallerySlider();
	}
	_initGallerySlider() {
		this.galleryContainer = document.querySelector('[data-features-gallery]');
		this.galleryNextEl = this.container.querySelector('.swiper-button-next');
		this.galleryPrevEl = this.container.querySelector('.swiper-button-prev');

		this.gallery = new Swiper(this.galleryContainer, {
			modules: [Navigation, EffectCards],
			effect: 'cards',
			cardsEffect: {
				perSlideOffset: 6,
			},
			navigation: {
				nextEl: this.galleryNextEl,
				prevEl: this.galleryPrevEl,
			},
			breakpoints: {
				641: {
					allowTouchMove: false,
				},
			},
		});

		const mqMobile = window.matchMedia('(max-width: 640px)');

		const onSliderInit = () => {
			this.activeItem = this.items[0];
			this.activeItem.classList.add(ClassName.ACTIVE);
		};
		const onSlideChange = ({ activeIndex }) => {
			this.activeItem.classList.remove(ClassName.ACTIVE);
			this.activeItem = this.items[activeIndex];
			this.activeItem.classList.add(ClassName.ACTIVE);
		};
		const onWindowResize = () => {
			if (mqMobile.matches) {
				onSliderInit();

				this.gallery.on('init', onSliderInit);
				this.gallery.on('slideChange', onSlideChange);
			} else {
				this.gallery.off('init', onSliderInit);
				this.gallery.off('slideChange', onSlideChange);
			}
		};

		mqMobile.addEventListener('change', onWindowResize);
		onWindowResize();
	}
	_initScrollAnim() {
		this.items = this.container.querySelectorAll('[data-features-item]');
		this.mm = gsap.matchMedia();

		this.items.forEach((item) => {
			this.mm.add('(min-width: 641px)', () => {
				ScrollTrigger.create({
					trigger: item,
					start: 'top 33%',
					end: 'bottom 33%',
					toggleClass: ClassName.ACTIVE,
					onEnter: () => {
						if (this.items[0] === item) {
							return;
						}
						this.gallery.slideNext();
					},
					onLeaveBack: () => {
						if (this.items[0] === item) {
							return;
						}
						this.gallery.slidePrev();
					},
				});
			});
		});
	}
}

export default new Features();
