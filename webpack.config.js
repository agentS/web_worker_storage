import path from "path";

const configuration = {
    entry: "./storage/index.ts",
    // devtool: "inline-source-map",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.txt$/,
                type: "asset/source",
            },
        ],
    },
    resolve: {
        extensions: [ ".ts" ],
    },
    output: {
        filename: "index.js",
        path: path.resolve("./dist"),
        library: "WebWorkerStorage",
    },
};
export default configuration;
