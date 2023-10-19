import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollLock from '../../assets/scripts/utils/scroll-lock';

const HTML_CLASSLIST = document.documentElement.classList;

const ClassName = {
	MENU_OPENED: '_menu-opened',
	MENU_OPENING: '_menu-opening',
	MENU_CLOSING: '_menu-closing',
	NO_SCROLL: '_no-scroll',
	SELECT_OPENED: '_select-opened',
};

class Menu {
	constructor() {
		this.init();
	}

	init() {
		this.container = document.querySelector('[data-menu]');
		this.header = document.querySelector('[data-header]');
		this.fixedButton = document.querySelector('.page__button._fixed');

		if (!this.container || !this.header) {
			return;
		}

		this._onOpenerClick = this._onOpenerClick.bind(this);
		this._onWindowKeydown = this._onWindowKeydown.bind(this);
		this._onWindowClick = this._onWindowClick.bind(this);

		const opener = this.container.querySelector('[data-menu-opener]');

		opener.addEventListener('click', this._onOpenerClick);
		window.addEventListener('keydown', this._onWindowKeydown);

		this.scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth;
		document.documentElement.style = `--scrollbar-width:${this.scrollbarWidth}px`;
	}
	open() {
		if (!HTML_CLASSLIST.contains(ClassName.NO_SCROLL)) {
			this.scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;
			document.documentElement.style = `--scrollbar-width:${this.scrollbarWidth}px`;
		}
		HTML_CLASSLIST.add(ClassName.MENU_OPENING);

		clearTimeout(this.animTO);
		this.animTO = setTimeout(() => {
			HTML_CLASSLIST.remove(ClassName.MENU_OPENING);
			HTML_CLASSLIST.add(ClassName.MENU_OPENED);
			window.addEventListener('click', this._onWindowClick);
		}, 300);

		ScrollLock.enable();
		ScrollTrigger.refresh();

		HTML_CLASSLIST.add(ClassName.NO_SCROLL);
	}
	close() {
		if (!HTML_CLASSLIST.contains(ClassName.MENU_OPENED)) {
			return;
		}
		HTML_CLASSLIST.add(ClassName.MENU_CLOSING);

		clearTimeout(this.animTO);
		this.animTO = setTimeout(() => {
			HTML_CLASSLIST.remove(ClassName.MENU_CLOSING);
			HTML_CLASSLIST.remove(ClassName.MENU_OPENED);
			window.removeEventListener('click', this._onWindowClick);
		}, 300);

		if (HTML_CLASSLIST.contains(ClassName.SELECT_OPENED)) {
			return;
		}

		if (HTML_CLASSLIST.contains('_popup-opened')) {
			return;
		}

		ScrollLock.disable();

		clearTimeout(this.TO);
		this.TO = setTimeout(() => {
			ScrollTrigger.refresh();
		}, 500);
		HTML_CLASSLIST.remove(ClassName.NO_SCROLL);
	}
	toggle() {
		HTML_CLASSLIST.contains(ClassName.MENU_OPENED) ? this.close() : this.open();
	}
	_onOpenerClick(evt) {
		evt.preventDefault();

		this.toggle();
	}
	_onWindowKeydown(evt) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}
	_onWindowClick(evt) {
		if (!evt.target.closest('[data-menu]')) {
			this.close();
		}
	}
}

export default new Menu();
