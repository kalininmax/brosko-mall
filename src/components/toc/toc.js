import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ClassName = {
	ACTIVE: '_active',
	NO_NATIVE_SMOOTH: '_no-native-smooth',
};

class Toc {
	constructor() {
		this.init();
	}

	init() {
		this.container = document.querySelector('[data-toc]');

		if (!this.container) {
			return;
		}

		document.documentElement.classList.add(ClassName.NO_NATIVE_SMOOTH);

		this.links = this.container.querySelectorAll('[data-link]');
		this.activeLink = Array.from(this.links).find(
			(link) => link.hash === window.location.hash
		);

		this._onContainerClick = this._onContainerClick.bind(this);
		this._scrollTriggerHandler = this._scrollTriggerHandler.bind(this);

		if (!this.activeLink) {
			this.activeLink = this.links[0];
		}

		window.addEventListener('load', () => {
			this._setActiveLink(this.activeLink);
			gsap.to(window, { duration: 0.3, scrollTo: this.activeLink.hash });
		});

		this.container.addEventListener('click', this._onContainerClick);
		window.addEventListener(
			'scroll',
			() => this.links.forEach(this._scrollTriggerHandler),
			{
				once: true,
			}
		);
	}

	_setActiveLink(link) {
		this.activeLink.classList.remove(ClassName.ACTIVE);
		this.activeLink = link;
		this.activeLink.classList.add(ClassName.ACTIVE);
		window.history.pushState({}, '', link.hash);

		gsap.to(this.container, {
			duration: 0.3,
			scrollTo: { x: link.offsetLeft },
			ease: 'linear',
		});
	}
	_scrollTriggerHandler(link, index) {
		const section = document.querySelector(
			`[data-section="${link.hash.substring(1)}"]`
		);

		ScrollTrigger.create({
			trigger: section,
			start: 'top 50%',
			end: 'bottom 50%',
			onEnter: () => {
				this._setActiveLink(this.links[index]);
			},
			onEnterBack: () => {
				this._setActiveLink(this.links[index]);
			},
		});

		ScrollTrigger.create({
			trigger: section,
			start: 'bottom bottom',
			end: 'bottom bottom',
			onLeave: () => {
				if (index === this.links.length - 1) {
					gsap.to(this.container, { autoAlpha: 0, y: 20, duration: 0.2 });
				}
			},
			onLeaveBack: () => {
				if (index === this.links.length - 1) {
					gsap.to(this.container, {
						autoAlpha: 1,
						y: 0,
						duration: 0.2,
						immediateRender: false,
					});
				}
			},
		});
	}
	_onContainerClick(evt) {
		const target = evt.target;

		if (target.hasAttribute('data-link')) {
			evt.preventDefault();

			this._setActiveLink(target);
			gsap.to(window, { duration: 0.3, scrollTo: target.hash });
		}
	}
}

export default new Toc();
