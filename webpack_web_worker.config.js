import path from "path";

const configuration = {
	entry: "./web_worker/web_worker.ts",
	// devtool: "inline-source-map",
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [ ".ts" ],
	},
	output: {
		filename: "web_worker.js",
		path: path.resolve("./dist"),
		library: "WebWorkerStorageInternal",
	},
};
export default configuration;
