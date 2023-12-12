const { $fetch } = require('ofetch');
module.exports = async function () {
	const headers = {
		Authorization:
			'Basic ' +
			Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`).toString(
				'base64'
			),
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};

	const response = await $fetch(process.env.API_URL, {
		method: 'post',
		body: {
			query: 'page("home")',
			select: {
				introVideo: 'page.introVideo.toFile.url',
				eventsTitle: true,
				topEvents: {
					query: 'page.topEvents.toPages',
					select: {
						mainTitle: true,
						coverImg: 'page.coverImg.toFile.url',
						bgColor: true,
						url: true,
						slug: true,
					},
				},
				events: {
					query: 'page.events.toPages',
					select: {
						mainTitle: true,
						coverImg: 'page.coverImg.toFile.url',
						bgColor: true,
						url: true,
						slug: true,
					},
				},
			},
		},
		headers,
	});

	return response.result;
};
