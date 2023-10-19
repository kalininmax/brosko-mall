import Popups from '../../../components/popups/popups';

const HTML_CLASSLIST = document.documentElement.classList;
const ClassName = {
	VACANCY_POPUP: '_vacancy-popup',
};

class Vacancy {
	constructor() {
		this.init();
	}

	init() {
		this.container = document.querySelector('.vacancies');

		if (!this.container) {
			return;
		}

		this.vacancyFormOpener = document.querySelectorAll(
			'[data-vacancy-form-opener]'
		);
		this.vacancyInfoOpener = document.querySelectorAll('[data-vacancy-back]');
		this.headerPopupButton = document.querySelector(
			'[data-header] [data-popup-opener="vacancy-form"]'
		);
		this.formPopup = Popups.getPopup('vacancy-form');

		this.showVacancyForm = this.showVacancyForm.bind(this);
		this.showVacancyInfo = this.showVacancyInfo.bind(this);

		this.vacancyFormOpener.forEach((opener) =>
			opener.addEventListener('click', this.showVacancyForm)
		);
		this.vacancyInfoOpener.forEach((opener) =>
			opener.addEventListener('click', this.showVacancyInfo)
		);

		this.headerPopupButton.addEventListener('click', () => {
			if (this.formPopup.querySelector('[name="VacancyName"]')) {
				this.formPopup.querySelector('[name="VacancyName"]').value = '';
			}
			HTML_CLASSLIST.remove(ClassName.VACANCY_POPUP);
		});
	}
	showVacancyForm() {
		this.activeVacancy = Popups.activePopupName;
		HTML_CLASSLIST.add(ClassName.VACANCY_POPUP);
		const vacancyPopup = Popups.getPopup(this.activeVacancy);

		const vacancyTitle =
			vacancyPopup.querySelector('.vacancy__title').textContent;

		this.formPopup.querySelector('[name="VacancyName"]').value = vacancyTitle;

		const onVacancyInfoClose = () => {
			if (this.activeVacancy) {
				Popups.open('vacancy-form');
			}
		};
		Popups.onClose.add(onVacancyInfoClose);
		Popups.close();

		setTimeout(() => {
			Popups.onClose.remove(onVacancyInfoClose);
		}, 380);
	}
	showVacancyInfo() {
		const onVacancyFormClose = () => {
			if (this.activeVacancy) {
				Popups.open(this.activeVacancy);
				HTML_CLASSLIST.remove(ClassName.VACANCY_POPUP);
			}
		};

		Popups.onClose.add(onVacancyFormClose);
		Popups.close();

		setTimeout(() => {
			Popups.onClose.remove(onVacancyFormClose);
			this.activeVacancy = Popups.activePopupName;
		}, 400);
	}
}

export default new Vacancy();
