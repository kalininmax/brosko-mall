module.exports = async function () {
	const response = await fetch(`${process.env.ROOT_URL}/home.json`).then(
		(res) => res.json()
	);

	return response;
};
