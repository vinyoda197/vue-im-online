var path = require('path')
var webpack = require('webpack')
var glob_entries = require('webpack-glob-entries')

var folder = (process.env.FOLDER == '')? "" : process.env.FOLDER + "/"
var filename = ((process.env.FOLDER == '')? "main" : process.env.FOLDER) + ".min.js"

var config = {
        entry: glob_entries('./src/' + folder + 'main.js'),
        output: {
            path: path.resolve(__dirname, './dist/min'),
            publicPath: '/dist/min/',
            filename: filename
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                            // the "scss" and "sass" values for the lang attribute to the right configs here.
                            // other preprocessors should work out of the box, no loader config like this necessary.
                            'scss': 'vue-style-loader!css-loader!sass-loader',
                            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                        }
                        // other vue-loader options go here
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]'
                    }
                }
            ]
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        },
        devServer: {
            historyApiFallback: true,
            noInfo: true
        },
        performance: {
            hints: false
        },
        devtool: '#eval-source-map'
    }

    module.exports = config

    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])


