import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper, { Autoplay, EffectCreative } from 'swiper';

class Intro {
	constructor() {
		this.container = document.querySelector('[data-intro]');

		if (!this.container) {
			return;
		}

		window.addEventListener('load', () => this.init());
	}

	init() {
		this.header = document.querySelector('[data-header]');
		this.menu = document.querySelector('[data-menu]');
		this.panel = this.menu.querySelector('.menu__panel');

		this.list = this.container.querySelector('.intro__list');
		this.links = this.list.querySelectorAll('.intro__link');

		this._desktopAnimation = this._desktopAnimation.bind(this);
		this._mobileAnimation = this._mobileAnimation.bind(this);

		this.header.classList.add('_intro');
		gsap.set([this.header, this.list], { autoAlpha: 1 });

		this._initSlider();

		this.mm = gsap.matchMedia();
		this.mm.add('(min-width: 641px)', this._desktopAnimation);
		this.mm.add('(max-width: 640px)', this._mobileAnimation);

		ScrollTrigger.create({
			trigger: this.container,
			start: 'top top',
			end: 'bottom top',
			onEnter: () => {
				this.header.classList.add('_intro');
			},
			onEnterBack: () => {
				this.header.classList.add('_intro');
			},
			onLeave: () => {
				this.header.classList.remove('_intro');
			},
		});
	}
	_initSlider() {
		const container = this.container.querySelector('[data-intro-slider]');
		const sliderWrapper = this.container.querySelector('.swiper-wrapper');

		if (!sliderWrapper) {
			return;
		}

		new Swiper(container, {
			modules: [Autoplay, EffectCreative],
			loop: true,
			autoplay: true,
			effect: 'creative',
			speed: 700,
			allowTouchMove: false,
			creativeEffect: {
				prev: {
					shadow: true,
					translate: ['-20%', 0, -1],
				},
				next: {
					translate: ['100%', 0, 0],
				},
			},
		});
	}
	_desktopAnimation() {
		const introAnimTL = gsap.timeline({
			paused: true,
			defaults: { ease: 'none' },
		});
		this.links.forEach((link, index) => {
			const number = index + 1;
			const linkTween = gsap.to(link, {
				yPercent: -100 * number,
			});

			introAnimTL.add(linkTween, 0);
		});
		introAnimTL.set(this.menu, {
			position: 'fixed',
			top: this.menu.offsetTop,
			left: '50%',
			xPercent: -50,
		});
		introAnimTL.to(this.menu, { top: 10 }, '>');
		introAnimTL.set(this.list, { autoAlpha: 0 }, '<');
		introAnimTL.to([this.menu, this.panel], {
			height: '2.8125rem',
		});

		ScrollTrigger.create({
			trigger: this.container,
			start: 'top top',
			end: 'bottom 20%',
			scrub: 1,
			animation: introAnimTL,
		});
	}
	_mobileAnimation() {
		const linksAnim = gsap.timeline({ paused: true });
		gsap.set(this.list, {
			top: '50%',
			left: '50%',
			xPercent: -50,
			yPercent: -50,
		});
		gsap.to(this.list, {
			top: 55,
			yPercent: 0,
			scrollTrigger: {
				trigger: this.container,
				start: 'top top',
				end: 'center 25%',
				scrub: 1,
			},
			immediateRender: false,
		});
		this.links.forEach((link, index) => {
			const linkTween = gsap.to(link, {
				yPercent: -100 * index - 50,
			});

			linksAnim.add(linkTween, 0);
		});
		ScrollTrigger.create({
			trigger: this.container,
			start: '25% 25%',
			end: '85% center',
			animation: linksAnim,
			scrub: 1,
			onEnterBack: () => gsap.set(this.list, { display: 'block' }),
			onLeave: () => gsap.set(this.list, { display: 'none' }),
		});
	}
}

export default new Intro();
