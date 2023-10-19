const body = document.querySelector('body');

let scrollPosition = 0;

export default {
	enable() {
		scrollPosition = window.scrollY;
		body.style.overflow = 'hidden';
		body.style.position = 'fixed';
		body.style.top = `-${scrollPosition}px`;
		body.style.width = '100%';
	},
	disable() {
		body.style.removeProperty('overflow');
		body.style.removeProperty('position');
		body.style.removeProperty('top');
		body.style.removeProperty('width');
		document.documentElement.style.scrollBehavior = 'auto';
		window.scrollTo(0, scrollPosition);
		document.documentElement.style.removeProperty('scrollBehavior');
	},
};
