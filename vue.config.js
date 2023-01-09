// vue.config.js
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
	transpileDependencies: ['@dcloudio/uni-ui'],
	configureWebpack: {
		plugins: [
			new CompressionWebpackPlugin({
				filename: '[path].gz[query]',
				algorithm: 'gzip',
				test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
				threshold: 10240, //对10K以上的数据进行压缩  
				minRatio: 0.8,
				deleteOriginalAssets: false, //是否删除源文件  
			}),
			// new BundleAnalyzerPlugin()
		]
	}
	// optimization: {
	// 	minimize: true
	// }
}
