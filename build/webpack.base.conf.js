const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const os = require('os');

const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

const isProd = !!(process.env.NODE_ENV === 'production');
const resolve = dir => path.join(__dirname, '..', dir);
const threadPool = HappyPack.ThreadPool({
	size: os.cpus().length,
});

const webpackConfig = {
	entry : {},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: isProd
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath,
		libraryTarget: 'umd',
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': resolve('src'),
			'@common': resolve('src/common'),
			'@service': resolve('src/service') 
		}
	},
	externals : {
		vue : {
			amd: 'vue',
			root: 'Vue',
			commonjs: 'vue',
			commonjs2: 'vue',
		},
		'vue-router' : {
			amd: 'vue-router',
			root: 'VueRouter',
			commonjs: 'vue-router',
			commonjs2: 'vue-router',
		},
	},
	module: {
		rules: [{
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: [resolve('src')],
            options: {
                formatter: require('eslint-friendly-formatter')
            }
        },{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: vueLoaderConfig,
		}, {
			test: /\.js$/,
			loader: 'happypack/loader?id=happybabel',
			// loader: 'babel-loader',
			include: [resolve('src'), resolve('node_modules/ajaks'),resolve('node_modules/xh-media-packages'),resolve('node_modules/element-ui')]
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 15000,
				name: utils.assetsPath('img/[name].[hash:7].[ext]')
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 15000,
				name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
			}
		}]
	},
	plugins: [
		new HappyPack({
			id: 'happybabel',
			loaders: ['babel-loader'],
			threadPool,
			verbose: true,
		}),
	]
};

// entries
fs.readdirSync('./example')
	.filter(k => (k !== 'common'))
	.forEach((k, i) => {
		const pathname = path.join('example', k, k);
		webpackConfig.entry[k] = './'+ pathname +'.js';
	});

// inject chunks
Object.keys(webpackConfig.entry).forEach(key => {
	if (key === 'vue') return;
	var Tpath = path.join('example', key, key) +'.html';
	console.log(Tpath);
	webpackConfig.plugins.push(
		new HtmlWebpackPlugin({
			filename: key +'.html',
			template: Tpath,
			inject: true,
			chunks: [key,'manifest','vendor'],
			isProd: isProd,
			path:{
                staticPath:isProd
                    ? config.build.cdnPath
                    : config.dev.cdnPath
			},
            version: (new Date()).getTime(),
            chunksSortMode: 'dependency'
		})
	)
});

module.exports = webpackConfig;
