import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

window.gsap = gsap;

gsap.config({
	nullTargetWarn: false,
});

class BroskoMall {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			Signal: require('./classes/Signal').default,
		};
		this.components = {
			Select: require('../../components/select/select').default,
			Menu: require('../../components/menu/menu').default,
			Intro: require('../../includes/home/intro/intro').default,
			Vacancy: require('../../includes/popups/vacancy/vacancy').default,
			Features: require('../../includes/cinema/features/features').default,
			Popups: require('../../components/popups/popups').default,
			Gallery: require('../../components/gallery/gallery').default,
			Slider: require('../../components/slider/slider').default,
			Input: require('../../components/input/input').default,
			Checkbox: require('../../components/input-checkbox/input-checkbox')
				.default,
			Form: require('../../components/form/form').default,
			Video: require('../../components/video/video').default,
			Accordion: require('../../components/accordion/accordion').default,
			Toc: require('../../components/toc/toc').default,
		};
		this.helpers = {};
		this.modules = {
			TextSplitter: require('./modules/TextSplitter').default,
			ScrollAnimations: require('./modules/ScrollAnimations').default,
			Ticker: require('./modules/Ticker').default,
			Header: require('./modules/HeaderFilter').default,
			ContactsMap: require('./modules/ContactsMap').default,
			MapFilter: require('./modules/MapFilter').default,
			Map: require('./modules/Map').default,
			Events: require('./modules/Events').default,
		};
		document.addEventListener('DOMContentLoaded', () => {
			document.documentElement.classList.remove('_loading');

			gsap.set('[header-slide-down]', { autoAlpha: 1 });
			gsap.fromTo(
				'[header-slide-down]',
				{ yPercent: -100 },
				{ yPercent: 0, duration: 0.3, delay: 0.7 }
			);

			document
				.querySelectorAll('[data-input]')
				.forEach((input) => new this.components.Input(input));
			document
				.querySelectorAll('[data-input-checkbox]')
				.forEach((input) => new this.components.Checkbox(input));
			document
				.querySelectorAll('[data-form]')
				.forEach((form) => new this.components.Form(form));

			let hash = window.location.hash;
			if (hash) {
				hash = hash.substring(1);

				this.components.Popups.close();
				if (this.components.Popups.getPopup(hash)) {
					this.components.Popups.open(hash);
				}
			}
		});

		window.addEventListener('load', () => {
			window.accordions = [];

			document.querySelectorAll('[data-accordion]').forEach((el) => {
				new this.components.Accordion(el);
			});
		});
	}
}

window.BroskoMall = new BroskoMall();
