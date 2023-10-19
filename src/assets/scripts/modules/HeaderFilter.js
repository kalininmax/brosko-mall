const ClassName = {
	FILTERED: '_filtered',
};

class HeaderFilter {
	constructor() {
		this.init();
	}

	init() {
		this.select = document.querySelector('[data-header-filter]');

		if (!this.select) {
			return;
		}

		this.activeFilterName = this.select.select.value;
		this.sections = document.querySelectorAll('[data-category-section]');
		this.items = document.querySelectorAll('[data-category-name]');

		this.select.select.addEventListener('change', (evt) => {
			this.activeFilterName = evt.target.value;

			if (this.activeFilterName === 'all') {
				this.resetFilterState();
				return;
			}

			this.updateFilterState();
		});
	}
	updateFilterState() {
		this.resetFilterState();

		const filteredItem = (item) => item.classList.contains(ClassName.FILTERED);

		this.filteredItems = Array.from(this.items).filter(
			(item) =>
				item.getAttribute('data-category-name') !== this.activeFilterName
		);

		this.filteredItems.forEach((item) =>
			item.classList.add(ClassName.FILTERED)
		);

		this.sections.forEach((section) => {
			const isEmptySection = Array.from(
				section.querySelectorAll('[data-category-name]')
			).every(filteredItem);

			if (isEmptySection) {
				section.classList.add(ClassName.FILTERED);
				document
					.querySelector(`[href="#${section.id}"]`)
					?.setAttribute('aria-disabled', true);
			}
		});
	}
	resetFilterState() {
		this.filteredItems &&
			this.filteredItems.forEach((item) =>
				item.classList.remove(ClassName.FILTERED)
			);

		this.sections.forEach((section) => {
			section.classList.contains(ClassName.FILTERED) &&
				section.classList.remove(ClassName.FILTERED);

			document
				.querySelector(`[href="#${section.id}"]`)
				?.removeAttribute('aria-disabled');
		});

		window.scrollTo(0, 0);
	}
}

export default new HeaderFilter();
