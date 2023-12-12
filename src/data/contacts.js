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
			query: 'page("contacts")',
			select: {
				mainTitle: true,
				headerLinkText: true,
				street: true,
				city: true,
				postcode: true,
				label2: true,
				label3: true,
				label4: true,
				openingHours: 'page.openingHours.toStructure',
				staffContacts: 'page.staffContacts.toStructure',
				socials: 'page.socials.toStructure',
			},
		},
		headers,
	});

	return response.result;
};
