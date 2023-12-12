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
			query: 'page("events").children',
			select: {
				title: true,
				slug: true,
				introImg: 'page.introImg.isNotEmpty ?? page.introImg.toFile.url',
				coverImg: 'page.coverImg.toFile.url',
			},
		},
		headers,
	});

	return response.result;
};
