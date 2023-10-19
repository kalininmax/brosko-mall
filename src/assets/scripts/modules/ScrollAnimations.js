import { gsap } from 'gsap';
import TextSplitter from './TextSplitter';

class ScrollAnimations {
	constructor() {
		window.addEventListener('load', () => {
			this.init();
		});
	}

	init() {
		this._initFadeInLetters();
		this._initFadeInSqueezeLetters();
		this._initFadeIn();
		this._initFadeInCards();
		this._initColoredImg();
		this._initParallaxImg();
		this._initParallaxCard();
		this._initZoomOut();
	}
	_initFadeInLetters() {
		const titles = document.querySelectorAll(
			'[data-animation="fadeInLetters"] span'
		);

		titles.forEach((title) => {
			const splitedText = TextSplitter.split(title, true);

			gsap.set(title.parentElement, { autoAlpha: 1 });
			gsap.fromTo(
				splitedText.letters,
				{ yPercent: 30, autoAlpha: 0 },
				{
					yPercent: 0,
					autoAlpha: 1,
					stagger: 0.1,
					scrollTrigger: {
						trigger: title,
						once: true,
					},
					clearProps: true,
				}
			);
		});
	}
	_initFadeInSqueezeLetters() {
		const titles = document.querySelectorAll(
			'[data-animation="fadeInSqueezeLetters"]'
		);

		titles.forEach((title) => {
			gsap.set(title.parentElement, { autoAlpha: 1 });
			gsap.fromTo(
				title,
				{ letterSpacing: '0.07em', autoAlpha: 0 },
				{
					letterSpacing: '0.02em',
					autoAlpha: 1,
					scrollTrigger: {
						trigger: title,
						once: true,
					},
					clearProps: 'letterSpacing,opacity',
				}
			);
		});
	}
	_initFadeIn() {
		const elements = document.querySelectorAll('[data-animation="fadeIn"]');

		elements.forEach((el) => {
			gsap.set(el, { autoAlpha: 1 });
			gsap.fromTo(
				el,
				{ yPercent: 30, autoAlpha: 0 },
				{
					yPercent: 0,
					autoAlpha: 1,
					stagger: 0.1,
					scrollTrigger: {
						trigger: el,
						once: true,
					},
					clearProps: 'opacity,transform',
				}
			);
		});
	}
	_initFadeInCards() {
		const container = document.querySelectorAll(
			'[data-animation="fadeInCards"]'
		);
		const items = document.querySelectorAll(
			'[data-animation="fadeInCards"] > *'
		);

		if (!container || !items) {
			return;
		}

		gsap.set(container, { autoAlpha: 1 });
		gsap.fromTo(
			items,
			{ yPercent: 40 },
			{
				yPercent: 0,
				stagger: 0.1,
				scrollTrigger: {
					trigger: container,
					once: true,
				},
				clearProps: 'transform',
			}
		);
	}
	_initColoredImg() {
		const imageWrappers = document.querySelectorAll(
			'[data-animation="coloredImg"]'
		);
		const images = document.querySelectorAll(
			'[data-animation="coloredImg"] img'
		);

		if (!imageWrappers || !images) {
			return;
		}

		gsap.to(images, {
			autoAlpha: 1,
			stagger: 0.1,
			scrollTrigger: { trigger: imageWrappers, once: true },
			clearProps: 'opacity',
		});
	}
	_initParallaxImg() {
		const imgContainer = document.querySelectorAll('[data-parallax-img]');

		imgContainer.forEach((container) => {
			const img = container.querySelector('img');

			gsap.set(container, { autoAlpha: 1 });
			gsap.fromTo(
				img,
				{ top: '-5%' },
				{
					top: '5%',
					scrollTrigger: {
						trigger: container,
						start: 'top center',
						end: 'bottom top',
						scrub: true,
					},
				}
			);
		});
	}
	_initParallaxCard() {
		const cards = document.querySelectorAll('[data-parallax-card]');

		cards.forEach((card) => {
			gsap.set(card, { autoAlpha: 1 });
			gsap.fromTo(
				card,
				{ yPercent: 30 },
				{
					yPercent: -30,
					scrollTrigger: {
						trigger: card.parentElement,
						start: '30% center',
						end: 'bottom top',
						scrub: true,
					},
				}
			);
		});
	}
	_initZoomOut() {
		const imageContainers = document.querySelectorAll(
			'[data-animation="ZoomOut"]'
		);

		imageContainers.forEach((container) => {
			const img = container.querySelector('img');

			gsap.set(container, { autoAlpha: 1, clearProps: 'opacity' });
			gsap.fromTo(
				img,
				{ scale: 1.3 },
				{
					scale: 1,
					duration: 2.5,
					scrollTrigger: {
						trigger: container,
						once: true,
					},
					clearProps: 'scale,transform',
				}
			);
		});
	}
}

export default new ScrollAnimations();
