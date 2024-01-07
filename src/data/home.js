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
				introMenuPages: 'page.introMenuPages.toStructure',
				introVideo: 'page.introVideo.toFile.url',
				eventsTitle: true,
				tickerTitle: true,
				communeTitle: true,
				communeSlogan: true,
				communeCardImg: 'page.communeCardImg.toFile.url',
				communeCardText: 'page.communeCardText.kt',
				communeCardLinkText: true,
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
				ticker1: 'page.ticker1.toStructure',
				ticker2: 'page.ticker2.toStructure',
				otherPages: {
					query: 'page.otherPages.toPages',
					select: {
						mainTitle: true,
						coverImg: 'page.coverImg.toFile.url',
						imgPosition: true,
						cardColor: true,
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
