import path from "path";
import CopyPlugin from "copy-webpack-plugin";

const configuration = {
	entry: "./web_worker/web_worker.ts",
	// devtool: "inline-source-map",
	devtool: "source-map",
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve("./dist/web_worker.js"),
					to: path.resolve("./storage/web_worker.txt"),
					force: true,
				},
			],
		})
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
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
