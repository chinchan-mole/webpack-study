const path = require('path');
// 打包html的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 自动清空dist目录的插件
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
// 抽离CSS文件的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩CSS的插件(还会去掉注释)，只有production环境才生效
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// 多进程打包（不是多线程！！！JS依旧是单线程）
const Happypack = require('happypack')
module.exports = {
    mode: 'production',
    entry: {
        // 多入口
        index: path.join(__dirname, 'src', 'index.js'),
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
                test: /\.css$/,
                // 生产模式需要抽离CSS，不可用style-loader
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
                // 生产环境图片使用url-loader处理(url-loader可以执行base64图片编码)
            {
                test: /\.(jpg)|(jpeg)|(png)|(gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 小于5KB的图片被编码处理
                        limit: 5 * 1024,
                        // 超过5KB的图片不会被编码，打包后被输出至下目录
                        outputPath: '/img/'
                    }
                }
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
            // 注：如果不设置chunks，那么打包出来的html会默认引用所有的入口文件，本例中如果两个都不设置chunks，两个html都会引用index.js和other.js打包后的js文件
            // 生产模式还抽离了公共代码（抽出了name为vendor和common的两个chunk），所以还需要引入抽出的chunks
            chunks: ['index', 'vendor', 'common']
        }),
        new HtmlWebpackPlugin({
            template: './src/other.html',
            filename: 'other.html',
            chunks: ['other', 'vendor', 'common']
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            // filename属性设置抽离后的CSS文件名和路径，可以使用name变量和哈希，文件会被自动用link标签被html引入
            filename: 'css/[name].[hash:8].css'
        }),
    ],
    optimization: {
        // 压缩CSS
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSPlugin({})],
        // 分割代码块（抽离公共部分）
        splitChunks: {
            // chunks有三个值： initial 入口chunk，只处理直接引入的不处理异步导入文件； async 异步chunk，只处理异步导入文件 ； all 都chunk
            chunks: 'all',
            // 缓存分组
            cacheGroups: {
                // 第三方模块vendero
                vendor: {
                    name: 'vendor', // 第三方模块代码取名vendor
                    priority: 1, // 权限更高优先抽离（如果与公共模块冲突，优先命中第三方模块）
                    test: /node_modules/, // 命中规则
                    minSize: 0, // 大小限制，最小被拆包的模块大小，真实情况需要设置大小，如3kb等，这里为了演示设为0表示一律打包
                    minChunks: 1 // 最少被复用过几次。注：第三方模块只要被用过就需要抽离
                },
                // 公共模块
                common: {
                    name: 'common', // chunk名称
                    priority: 0,
                    minSize: 0,
                    minChunks: 2 // 注：被复用过2次及以上才能算是公共代码需要抽离
                }
            }
        }
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    }
}