const path = require("path")
const webpackFriendlyMessage = require("friendly-errors-webpack-plugin")
const useScss = require("mini-css-extract-plugin")
const htmlPlugin = require("html-webpack-plugin")
const terser = require("terser-webpack-plugin")
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin")
const webpackPWA = require("webpack-pwa-manifest")
const webpackDotenv = require("dotenv-webpack");
import {EnvironmentPlugin} from "webpack";

module.exports = env => {

	const defaultPugins = [
		new htmlPlugin({
			inject: true,
			template: "./public/index.html",
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				removeScriptTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			}
		}),
		new ScriptExtHtmlWebpackPlugin({
			prefetch: [/\.js$/],
			defaultAttribute: 'async'
		}),
		new useScss({
			filename: "style.css"
		}),
		new webpackFriendlyMessage({
			compilationSuccessInfo: {
				messages: ['You application is running here http://localhost:8080']
			},
		}),
		new webpackPWA({
			name: 'Hello World',
			short_name: 'Hello World',
			description: 'Your PWA App',
			theme_color: '#212121',
			background_color: '#212121',
			icons: [
				{
					src: path.resolve('public/favicon.png'),
					sizes: [36, 48, 72, 96, 144, 192, 512],
					ios: true
				}
			]
		}),
		new EnvironmentPlugin({
			API_KEY = "18ac21a546b0446fa4659315f42934ff"
		})
	]

	const pluginsDev = [
		new webpackDotenv()
	]

	return {
		target: 'web',
		entry: {
			index: path.resolve("src", "index.js")
		},
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "js/[name].[hash].bundle.js"
		},
		optimization: {
			splitChunks: {
				chunks: "all"
			},
			minimizer: [
				new terser({
					terserOptions: {
						compress: {
							ecma: 5,
							warnings: false,
							comparisons: false,
							inline: 2
						},
						parse: {
							ecma: 8
						},
						mangle: { safari10: true },
						output: {
							ecma: 5,
							safari10: true,
							comments: false,
							ascii_only: true
						}
					},
					parallel: true,
					sourceMap: false,
					cache: true
				})
			],
		},
		devServer: {
			contentBase: path.resolve("public"),
			compress: true,
			port: 8080,
			disableHostCheck: true,
			historyApiFallback: true,
			quiet: true
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: "babel-loader"
					}
				},
				{
					test: /\.scss$/,
					use: [useScss.loader, "css-loader", "sass-loader"],
				},
				{
					test: /\.(jpg|png|svg|jpeg|gif)$/,
					use: [{
						loader: "file-loader",
						options: { name: "[name].[ext]", outputPath: "img/" }
					}]
				}
			]
		},
		plugins: env.mode === "development" ? [...defaultPugins, ...pluginsDev] : [...defaultPugins]
	};
}
