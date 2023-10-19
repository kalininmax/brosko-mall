import Map from './Map';

const ClassName = {
	ACTIVE: '_active',
	HIDDEN: '_hidden',
};

class MapFilter {
	constructor() {
		this.init();
	}

	init() {
		this.headerFilter = document.querySelector('[data-map-filter="header"]');

		if (!this.headerFilter) {
			return;
		}

		this.filter = null;
		this.floorSections = document.querySelectorAll('.map__floor-list');

		this.mapListItems = document.querySelectorAll('[data-map-list-item]');

		this._onHeaderFilterClick = this._onHeaderFilterClick.bind(this);

		this.headerFilter.addEventListener('click', this._onHeaderFilterClick);

		this.mapListItems.forEach((item) => {
			item.addEventListener('mouseenter', (evt) => {
				const link = evt.target.querySelector('a[href]');

				this.highlightArea(link);
			});

			item.addEventListener('click', (evt) => {
				evt.preventDefault();

				this.highlightArea(evt.target);
			});
		});

		const hash = window.location.hash;
		if (hash) {
			if (hash.endsWith('-category')) {
				const id = hash.substring(1);

				switch (hash) {
					case '#store-category':
						this.setFilter(id);
						break;
					case '#cafe-category':
						this.setFilter(id);
						break;
					case '#service-category':
						this.setFilter(id);
						break;
					default:
						break;
				}
				return;
			}

			if (hash.startsWith('#region-')) {
				const id = hash.substring(8);
				Map.scrollFloorList(id, true);
			}
		}
	}
	highlightArea(link, id) {
		if (id && id.startsWith('floor-')) {
			return;
		}

		if (this.activeLink !== link) {
			if (this.activeArea) {
				this.activeLink && this.activeLink.classList.remove(ClassName.ACTIVE);
			}

			this.activeLink =
				link || document.querySelector(`[data-popup-opener="${id}"]`);
			id && this.activeLink.classList.add(ClassName.ACTIVE);
		}

		const floorNumber = this.activeLink.getAttribute('data-floor');
		if (floorNumber) {
			Map.setFloor(floorNumber);
		}
	}
	_onHeaderFilterClick(evt) {
		evt.preventDefault();

		const target = evt.target;
		const filterName = target.getAttribute('data-map-filter-button');

		if (this.activeButton === target) {
			this.resetFilters();
			return;
		}

		this.resetFilters();
		this.activeButton = target;
		this.activeButton.classList.add(ClassName.ACTIVE);
		this.setFilter(filterName);
	}
	setFilter(name) {
		const filteredItem = (item) => item.classList.contains(ClassName.HIDDEN);

		if (name) {
			this.filter = name;
		}

		this.mapListItems.forEach((item) => {
			const category = item.getAttribute('data-map-list-item');
			const isActive = this.filter === category;

			isActive
				? item.classList.remove(ClassName.HIDDEN)
				: item.classList.add(ClassName.HIDDEN);
		});

		this.floorSections.forEach((section, i) => {
			const isEmptySection = Array.from(
				section.querySelectorAll('[data-map-list-item]')
			).every(filteredItem);

			if (isEmptySection) {
				section.classList.add(ClassName.HIDDEN);
				document
					.querySelector(`[data-map-floor="${i}"]`)
					?.setAttribute('disabled', true);
			}
		});

		const notHiddenSection = document.querySelector(
			'.map__floor-list:not(._hidden)'
		);

		if (
			this.floorSections[Map.activeFloor].classList.contains(
				ClassName.HIDDEN
			) &&
			notHiddenSection
		) {
			Map.setFloor(notHiddenSection.id[6]);
		}
	}
	resetFilters() {
		this.filter = null;

		this.activeButton?.classList.remove(ClassName.ACTIVE);
		this.activeButton = null;

		this.mapListItems.forEach((item) => {
			item.classList.remove(ClassName.HIDDEN);
		});

		this.floorSections.forEach((section, i) => {
			section.classList.remove(ClassName.HIDDEN);
			document
				.querySelector(`[data-map-floor="${i}"]`)
				?.removeAttribute('disabled');
		});

		window.history.pushState(
			'',
			document.title,
			window.location.pathname + window.location.search
		);
	}
}

export default new MapFilter();
