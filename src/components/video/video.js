class Video {
	constructor() {
		document
			.querySelectorAll('[data-video]')
			.forEach((video) => this.init(video));
	}

	init(container) {
		this.container = container;

		if (!this.container) {
			return;
		}

		const link = this.container.querySelector('.video__link');
		const button = this.container.querySelector('.video__button');
		const id = this._parseLinkURL(link);

		this.container.addEventListener(
			'click',
			() => {
				const iframe = this._createIframe(id);

				link.remove();
				button.remove();
				this.container.appendChild(iframe);
			},
			{ once: true }
		);

		link.removeAttribute('href');
		this.container.classList.add('_enabled');
	}
	_parseLinkURL(link) {
		const regexp = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/i;
		const url = link.href;
		const match = url.match(regexp);

		return match[1];
	}
	_createIframe(id) {
		const iframe = document.createElement('iframe');

		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('allow', 'autoplay');
		iframe.setAttribute('src', this._generateURL(id));
		iframe.classList.add('video__iframe');

		return iframe;
	}
	_generateURL(id) {
		const query = '?rel=0&showinfo=0&autoplay=1';

		return 'https://www.youtube.com/embed/' + id + query;
	}
}

export default new Video();
