/* eslint-disable no-undef */
import Env from '../utils/env';
class ContactsMap {
	constructor() {
		this.init();
	}

	init() {
		this.container = document.querySelector('[data-map="ya"]');
		this.longitude = this.container?.getAttribute('data-longitude');
		this.latitude = this.container?.getAttribute('data-latitude');

		if (!this.container || !this.longitude || !this.latitude) {
			return;
		}

		const center = [this.latitude, this.longitude];

		ymaps.ready(() => {
			const map = new ymaps.Map(this.container, {
				center: center,
				zoom: 16,
			});

			const placemark = new ymaps.Placemark(
				center,
				{},
				{
					preset: 'islands#redIcon',
				}
			);

			map.geoObjects.add(placemark);
			map.behaviors.disable('scrollZoom');

			if (Env.isMobile) {
				const eventsPane = map.panes.get('events');
				const eventsPaneEl = eventsPane.getElement();
				const lang = document.documentElement.lang.toUpperCase();

				const mobilePanelText = {
					EN: 'Use two fingers to move the map',
					RU: 'Чтобы переместить карту проведите по ней двумя пальцами',
					FR: 'Utilisez deux doigts pour déplacer la carte',
					DE: 'Verschieben der Karte mit zwei Fingern',
					ES: 'Para mover el mapa, utiliza dos dedos',
					PT: 'Use dois dedos para mover o mapa',
					UK: 'Переміщуйте карту двома пальцями',
					JA: '地図を移動させるには指 2 本で操作します',
					ZH: '使用双指移动地图',
					PL: 'Przesuń mapę dwoma palcami',
					KK: 'Картаны екі саусақпен жылжытыңыз',
					IT: 'Utilizza due dita per spostare la mappa',
					LV: 'Lai pārvietotu karti, bīdiet to ar diviem pirkstiem',
				};

				const mobilePanelStyles = {
					alignItems: 'center',
					boxSizing: 'border-box',
					color: 'white',
					display: 'flex',
					justifyContent: 'center',
					fontSize: '22px',
					fontFamily: 'Arial,sans-serif',
					opacity: '0.0',
					padding: '25px',
					textAlign: 'center',
					transition: 'opacity .3s',
					touchAction: 'auto',
				};

				Array.prototype.forEach.call(Object.keys(mobilePanelStyles), (name) => {
					eventsPaneEl.style[name] = mobilePanelStyles[name];
				});

				map.behaviors.disable('drag');
				ymaps.domEvent.manager.add(eventsPaneEl, 'touchmove', (event) => {
					if (event.get('touches').length === 1) {
						eventsPaneEl.style.transition = 'opacity .3s';
						eventsPaneEl.style.background = 'rgba(0, 0, 0, .45)';
						eventsPaneEl.textContent =
							mobilePanelText[lang] || mobilePanelText['EN'];
						eventsPaneEl.style.opacity = '1';
					}
				});
				ymaps.domEvent.manager.add(eventsPaneEl, 'touchend', () => {
					eventsPaneEl.style.transition = 'opacity .8s';
					eventsPaneEl.style.opacity = '0';
				});
			}
		});
	}
}

export default new ContactsMap();
