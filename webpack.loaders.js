// WARNING: Do not use any other loader, since are ignored from the final build!

module.exports = [
	{
		test: /\.js$/,
		use: [
			'babel-loader',
		],
	},
	{
		// typescript loader
		test: /\.(tsx|ts)$/,
		use: [
			'babel-loader',
			'awesome-typescript-loader',
		],
	},
];
