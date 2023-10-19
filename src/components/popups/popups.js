import { gsap } from 'gsap';
import Signal from '../../assets/scripts/classes/Signal';
import ScrollLock from '../../assets/scripts/utils/scroll-lock';

const HTML_CLASSLIST = document.documentElement.classList;
const ClassName = {
	NO_SCROLL: '_no-scroll',
};

class Popups {
	constructor() {
		this.init();
	}

	init() {
		this.wrapper = document.querySelector('[data-popups]');

		if (!this.wrapper) {
			return;
		}

		this.onOpen = new Signal();
		this.onClose = new Signal();
		this.onCloseStart = new Signal();

		this.opened = false;
		this.openedClass = '';

		this.activePopup = null;
		this.activePopupName = '';
		this.popups = document.querySelectorAll('[data-popup]');

		const slideInAnimation = (popup, completeHandler) => {
			gsap.fromTo(
				popup,
				{ xPercent: 100, display: 'block' },
				{
					duration: 0.35,
					xPercent: 0,
					clearProps: 'transform',
					onComplete: () => {
						completeHandler();
					},
				}
			);
		};
		const slideOutAnimation = (popup, immediate, completeHandler) => {
			gsap.to(popup, {
				duration: immediate ? 0 : 0.35,
				xPercent: 100,
				display: 'none',
				clearProps: 'transform',
				onComplete: () => {
					completeHandler();
				},
			});
		};

		this.animations = {
			slideIn: slideInAnimation,
			slideOut: slideOutAnimation,
		};

		Array.from(document.querySelectorAll('[data-popup-opener]')).forEach(
			(element) => {
				element.addEventListener('click', (e) => {
					e.preventDefault();

					// if (window.innerWidth < 768 && e.target.hasAttribute('data-region-id')) {
					// 	return;
					// }

					this.open(
						e.currentTarget.getAttribute('data-popup-opener'),
						e.currentTarget
					);
				});
			}
		);

		Array.from(document.querySelectorAll('[data-popup-closer]')).forEach(
			(element) => {
				element.addEventListener('click', (e) => {
					e.target.tagName !== 'A' && e.preventDefault();

					this.close();
				});
			}
		);

		window.addEventListener('keydown', (e) => {
			if (this.opened && e.key === 'Escape') {
				this.close();
			}
		});

		this.wrapper.addEventListener('click', (e) => {
			if (this.opened) {
				if (e.target === this.wrapper) {
					this.close();
				}
			}
		});
	}
	open(name, opener) {
		if (this.activePopupName === name || this.animating) {
			return;
		}

		if (this.opened) {
			this.close(true);
		}

		const popup = this.wrapper.querySelector('[data-popup="' + name + '"]');

		if (!popup) {
			console.log('No popup for ' + name + ' opener');
			console.log(opener);
			return;
		}

		this.opened = true;
		this.activePopup = popup;
		this.activePopupName = name;
		this.popupOpenAnimation = this.activePopup.getAttribute(
			'data-popup-open-animation'
		);

		this.wrapper.classList.add('_' + name);

		this.wrapper.classList.remove('no-pe');
		gsap.set(this.wrapper, { autoAlpha: 1 });
		gsap.to(this.wrapper, {
			duration: 0.35,
			overwrite: true,
			display: 'flex',
		});

		if (this.activePopup.getAttribute('data-popup') === 'image') {
			const imgURL = opener.getAttribute('href');
			const imgEl = this.activePopup.querySelector('.image-popup__img');

			imgEl.src = imgURL;
		}

		const completeHandler = () => {
			const focusElement = this.activePopup.querySelector('[data-popup-focus]');

			if (focusElement) {
				focusElement.focus && focusElement.focus();
			}

			this.animating = false;
		};

		this.animating = true;
		if (this.animations[this.popupOpenAnimation]) {
			this.animations[this.popupOpenAnimation](
				this.activePopup,
				completeHandler
			);
		} else {
			gsap.fromTo(
				this.activePopup,
				{ autoAlpha: 0, scale: 0.98, display: 'block' },
				{
					duration: 0.35,
					autoAlpha: 1,
					scale: 1,
					clearProps: 'transform',
					onComplete: () => {
						completeHandler();
					},
				}
			);
		}

		HTML_CLASSLIST.add('_popup-opened');

		this.openedClass = '_popup-opened-' + name;
		HTML_CLASSLIST.add(this.openedClass);

		ScrollLock.enable();

		HTML_CLASSLIST.add(ClassName.NO_SCROLL);

		window.history.pushState({}, '', `#${name}`);

		this.onOpen.call();
	}
	close(immediate = false) {
		if (this.animating) {
			return;
		}

		if (this.opened) {
			this.opened = false;

			this.wrapper.classList.remove('_' + this.activePopupName);

			this.onCloseStart.call(this.activePopupName);
			this.popupCloseAnimation = this.activePopup.getAttribute(
				'data-popup-close-animation'
			);

			this.activePopupName = '';

			this.wrapper.classList.add('no-pe');
			gsap.to(this.wrapper, { duration: 0.35, display: 'none' });

			const completeHandler = () => {
				if (!HTML_CLASSLIST.contains('_menu-opened')) {
					ScrollLock.disable();
					HTML_CLASSLIST.remove(ClassName.NO_SCROLL);
				}
				this.animating = false;
				this.onClose.call();
			};

			this.animating = true;
			if (this.animations[this.popupCloseAnimation]) {
				this.animations[this.popupCloseAnimation](
					this.activePopup,
					immediate,
					completeHandler
				);
			} else {
				gsap.to(this.activePopup, {
					duration: immediate ? 0 : 0.35,
					autoAlpha: 0,
					scale: 0.98,
					display: 'none',
					clearProps: 'transform',
					onComplete: () => {
						completeHandler();
					},
				});
			}

			HTML_CLASSLIST.remove('_popup-opened');

			if (this.openedClass !== '') {
				HTML_CLASSLIST.remove(this.openedClass);
				this.openedClass = '';
			}

			window.history.pushState(
				'',
				document.title,
				window.location.pathname + window.location.search
			);
		}
	}
	getPopup(name) {
		return this.wrapper.querySelector('[data-popup="' + name + '"]');
	}
}

export default new Popups();
