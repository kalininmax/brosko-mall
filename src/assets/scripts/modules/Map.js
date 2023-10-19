import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

const ClassName = {
	ACTIVE: '_active',
	MORE_LINK: '_more-link',
};

const MOBILE_WIDTH = 767;
const getDefaultZoom = () => (window.innerWidth > MOBILE_WIDTH ? 0.2 : 0.1);
const getMaxZoom = () => (window.innerWidth > MOBILE_WIDTH ? 0.6 : 0.5);
const getZoomStep = () => (window.innerWidth > MOBILE_WIDTH ? 0.1 : 0.05);

class Map {
	constructor() {
		this.init();

		window.addEventListener('load', () => {
			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 500);

			const hash = window.location.hash;

			if (hash.startsWith('#floor-')) {
				this.scrollFloorList(hash);

				this.setFloor(hash[hash.length - 1]);
			}
		});
	}

	init() {
		this.container = document.querySelector('[data-map="mall"]');

		if (!this.container) {
			return;
		}

		this.mapContainer = this.container.querySelector('[data-map-container]');
		this.mapImgContainer = this.container.querySelector(
			'[data-map-img-container]'
		);
		this.zoomButtons = this.container.querySelectorAll('[data-map-zoom]');
		this.floorButtons = this.container.querySelectorAll('[data-map-floor]');
		this.moreLink = this.container.querySelector('[data-map-more-link]');
		this.mapImages = this.container.querySelectorAll('[data-map-img]');

		this.setFloor(1);
		this.scrollFloorList('#floor-1');

		this._onZoomButtonClick = this._onZoomButtonClick.bind(this);
		this._onFloorButtonClick = this._onFloorButtonClick.bind(this);

		this.floorButtons.forEach((button) =>
			button.addEventListener('click', this._onFloorButtonClick)
		);
		this.zoomButtons.forEach((button) =>
			button.addEventListener('click', this._onZoomButtonClick)
		);

		const mqMobile = window.matchMedia(`(max-width:${MOBILE_WIDTH}px)`);

		const onWindowResize = () => {
			if (mqMobile.matches) {
				this.currentZoom = getDefaultZoom();
				gsap.set(this.mapImgContainer, { scale: this.currentZoom });
			} else {
				this.currentZoom = getDefaultZoom();
				gsap.set(this.mapImgContainer, { scale: this.currentZoom });
			}
		};

		mqMobile.addEventListener('change', onWindowResize);
		onWindowResize();

		this.imgRect = this.mapImgContainer.getBoundingClientRect();
		this.getImgWidth = () => this.imgRect.width.toFixed();
		this.getImgHeight = () => this.imgRect.height.toFixed();
		this.getDraggableBounds = () => ({
			minX: this.getImgWidth() / -2,
			maxX: this.getImgWidth() / 2,
			minY: this.getImgHeight() / -2,
			maxY: this.getImgHeight() / 2,
		});

		this.draggable = Draggable.create(this.mapImgContainer, {
			type: 'x,y',
			trigger: this.container,
			bounds: this.getDraggableBounds(),
			onDragEnd: () => {},
		})[0];
	}
	setFloor(num) {
		if (this.activeFloor === Number(num)) {
			return;
		}

		this.activeButton && this.activeButton.classList.remove(ClassName.ACTIVE);
		this.mapImages[this.activeFloor]?.classList.remove(ClassName.ACTIVE);

		this.currentZoom = getDefaultZoom();

		this.activeFloor = Number(num);
		this.activeButton = this.floorButtons[this.activeFloor];
		this.activeButton.classList.add(ClassName.ACTIVE);
		this.mapImages[this.activeFloor].classList.add(ClassName.ACTIVE);

		gsap.set(this.mapImgContainer, {
			x: 0,
			y: 0,
			scale: this.currentZoom,
		});
	}
	setMaxZoom() {
		gsap.to(this.mapImgContainer, {
			scale: getMaxZoom(),
			duration: 0.3,
			onComplete: () => {
				this.imgRect = this.mapImgContainer.getBoundingClientRect();
				this.draggable.applyBounds(this.getDraggableBounds());
				gsap.to(this.mapImages, {
					color: 'red',
					duration: 0.1,
					delay: 0.05,
					clearProps: 'color',
				});

				if (window.innerWidth < 768) {
					window.BroskoMall.modules.MapFilter.moveToActiveArea();
				}
			},
		});
	}
	zoomIn(step) {
		const zoomStep = step || getZoomStep();
		this.currentZoom += this.currentZoom < getMaxZoom() ? zoomStep : 0;

		gsap.to(this.mapImgContainer, {
			scale: this.currentZoom,
			duration: 0.3,
			onComplete: () => {
				this.imgRect = this.mapImgContainer.getBoundingClientRect();
				this.draggable.applyBounds(this.getDraggableBounds());
				gsap.to(this.mapImages, {
					color: 'red',
					duration: 0.1,
					delay: 0.05,
					clearProps: 'color',
				});
			},
		});
	}
	zoomOut(step) {
		const zoomStep = step || getZoomStep();
		this.currentZoom -=
			this.currentZoom.toFixed(1) > getDefaultZoom() ? zoomStep : 0;

		gsap.to(this.mapImgContainer, {
			scale: this.currentZoom,
			duration: 0.3,
			onComplete: () => {
				this.imgRect = this.mapImgContainer.getBoundingClientRect();
				this.draggable.applyBounds(this.getDraggableBounds());
				gsap.to(this.mapImages, {
					color: 'red',
					duration: 0.1,
					delay: 0.05,
					clearProps: 'color',
				});
			},
		});
	}
	_onZoomButtonClick(evt) {
		evt.preventDefault();

		const target = evt.target;
		const value = target.getAttribute('data-map-zoom');

		if (value && value === '+') {
			this.zoomIn();
		}
		if (value && value === '-') {
			this.zoomOut();
		}
	}
	_onFloorButtonClick(evt) {
		evt.preventDefault();

		const target = evt.target;
		const num = target.getAttribute('data-map-floor');

		num && this.setFloor(num);

		const hash = `#floor-${num}`;
		this.scrollFloorList(hash);

		window.history.pushState({}, '', hash);
	}
	scrollFloorList(hash, region = false) {
		const floorLists = document.querySelectorAll('.map__floor-list');
		const scrollContainer = floorLists[0].parentElement;
		const offset = floorLists[0].offsetTop;

		if (region) {
			const floorList = document.querySelector(`[data-popup-opener="${hash}"]`);

			scrollContainer.scrollTo(0, floorList.offsetTop - offset);
			return;
		}

		const floorList = document.querySelector(hash);
		scrollContainer.scrollTo(0, floorList.offsetTop - offset);
	}
}

export default new Map();
