const webpack = require('webpack');
const path = require('path');
// 打包html的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 自动清空dist目录的插件
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
// HMR热更新插件
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
module.exports = {
    mode: 'development',
    entry: {
        // 多入口+index页面热更新
        index: ['webpack-dev-server/client?http://localhost:3000/', 'webpack/hot/dev-server', path.join(__dirname, 'src', 'index.js')],
        other: path.join(__dirname, 'src', 'other.js')
    },
    output: {
        // [name]用来匹配入口名字，[hash:8]表示在这里产生八位哈希
        filename: '[name].bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
                // 使用babel-loader处理JS文件,同时限制处理范围
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                // 开发模式CSS用采用style-loader处理更加方便
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // 开发环境图片使用file-loader处理
            {
                test: /\.(jpg)|(jpeg)|(png)|(gif)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // 打包模板
            template: './src/index.html',
            // 输出路径及文件名
            filename: 'index.html',
            // 设置HTML打包后引用的chunk，在多入口文件情况下必须设置以免打包后出现引用混淆
            // 不设置chunks，打包出来的html会默认引用所有的入口文件，本例中如果不设置chunks，两个html都会引用index.js和other.js打包后的js文件
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './src/other.html',
            filename: 'other.html',
            chunks: ['other']
        }),
        new CleanWebpackPlugin(),
        // 产生热更新插件实例
        new HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        // devServer开启热更新
        hot: true
    }
}