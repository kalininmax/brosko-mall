import customSelect from 'custom-select';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import env from '../../assets/scripts/utils/env';

const HTML_CLASSLIST = document.documentElement.classList;

const ClassName = {
	NO_SCROLL: '_no-scroll',
	SELECT_OPENED: '_select-opened',
	MENU_OPENED: '_menu-opened',
	MENU_OPENING: '_menu-opening',
};

class Select {
	constructor() {
		document
			.querySelectorAll('[data-select]')
			.forEach((container) => this.init(container));
	}

	init(container) {
		container.select = container.querySelector('[data-native-select]');

		customSelect(container.select)[0];

		container.select.customSelect.container.addEventListener(
			'custom-select:open',
			() => {
				HTML_CLASSLIST.add(ClassName.SELECT_OPENED);
				if (HTML_CLASSLIST.contains(ClassName.MENU_OPENED)) {
					return;
				}

				if (!env.isIOS) {
					disableBodyScroll(container);
				}
				if (env.isIOS) {
					document.body.style.overflow = 'hidden';
				}
				HTML_CLASSLIST.add(ClassName.NO_SCROLL);
			}
		);
		container.select.customSelect.container.addEventListener(
			'custom-select:close',
			() => {
				HTML_CLASSLIST.remove(ClassName.SELECT_OPENED);
				if (
					HTML_CLASSLIST.contains(ClassName.MENU_OPENED) ||
					HTML_CLASSLIST.contains(ClassName.MENU_OPENING)
				) {
					return;
				}

				if (!env.isIOS) {
					enableBodyScroll(container);
				}
				if (env.isIOS) {
					document.body.style.overflow = '';
				}
				HTML_CLASSLIST.remove(ClassName.NO_SCROLL);
			}
		);
	}
}

export default new Select();
