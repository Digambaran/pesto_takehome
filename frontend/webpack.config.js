const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');


const isEnvProduction = true;

module.exports = {
    entry: './src/index.tsx',
    mode: isEnvProduction ? 'production' : 'development',
    module: {
        rules: [
            {
                /**
                * babel-loader is reasonably fast and has caching, but doesn't yet do type-checking
                * for typescript on build,
                * will have to use tsc, and do a type-check or use ts-loader
                * other option ( the one used in CRA ) is to use fork-ts-checker-webpack-plugin
                * which will use a new process to do the type checking ans is hence fast
                */
                test: /\.tsx?$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                options: {
                    presets: [

                        "@babel/preset-env",
                        [
                            "@babel/preset-react",
                            {
                                /**
                                 * "automatic" option lets us to not import react into scope just to
                                 * use JSX. In "classic" option, React needs to be in scope everywhere 
                                 * you use JSX. Introduced in React 17.
                                 */
                                runtime: "automatic"
                            }
                        ],
                        "@babel/preset-typescript"
                    ],
                    /**
                     * This is a feature of `babel-loader` for webpack (not Babel itself).
                     * It enables caching results in ./node_modules/.cache/babel-loader/
                     * directory for faster rebuilds.
                     *  */
                    cacheDirectory: true,
                    cacheCompression: false,
                    compact: true,
                }
            },
            // {
            //     test: /\.tsx$/,
            //     exclude: /(node_modules|bower_components)/,
            //     use: {
            //         /**
            //          * swc-loader is fast, but doesn't yet do type-checking on build,
            //          * will have to use tsc, and do a type-check or use ts-loader
            //          * other option ( the one used in CRA ) is to use fork-ts-checker-webpack-plugin
            //          * which will use a new process to do the type checking ans is hence fast
            //          */
            //         loader: "swc-loader",
            //         options: {
            //             jsc: {
            //                 parser: {
            //                     syntax: "typescript",
            //                     tsx: true
            //                 },
            //                 transform: {
            //                     react: {
            //                         /**
            //                          * "automatic" option lets us to not import react into scope just to
            //                          * use JSX. In "classic" option, React needs to be in scope everywhere 
            //                          * you use JSX. Introduced in React 17.
            //                          */
            //                         runtime: "automatic"
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                use: ["style-loader", "css-loader"]
            }
        ],
    },
    optimization:
        Object.assign(
            {},
            isEnvProduction && {
                /**
                 * In production only
                 */
                splitChunks: {
                    /**
                     * https://webpack.js.org/plugins/split-chunks-plugin/
                     * Another excellent literatures on caching 
                     *  - https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
                     *  - https://github.com/webpack/webpack.js.org/issues/652
                     *  - https://github.com/facebook/create-react-app/discussions/9161
                     */
                    cacheGroups: {
                        vendor: {
                            /**
                             * extract react & react-dom into a new chunk for caching
                             */
                            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                            name: 'vendor',
                            chunks: 'all',
                        },
                    },
                },
                runtimeChunk: {
                    /**
                     * Extract webpack runtime to a new chunk named runtime.<hash>.js
                    */
                    name: 'runtime',
                }
            }
        ),
    resolve: {
        extensions: ['.tsx'],
        alias: {
            styles: path.resolve(__dirname, 'src/styles')
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        /**
         * clean can be configured to move changing files into an ignored/ folder,
         * or use "dry" option to log changing file names etc..
         * true => will overwrite changed files
         */
        clean: true,
        // There will be one main bundle, and one file per asynchronous chunk.
        // In development, it does not produce real files.
        filename: isEnvProduction
            ? 'static/js/[name].[contenthash:8].js'
            : 'static/js/bundle.js',
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: isEnvProduction
            ? 'static/js/[name].[contenthash:8].chunk.js'
            : 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[name].[hash][ext]',
    },
    plugins: [
        new HTMLWebpackPlugin(
            /**
             * HTMLWebpackPlugin on the base level is simply a tool that adds the bundle created by
             * the bundler ( webpack in this case ) and add it to the script tag in an html file, index.html by default
             * can also be used to add tags at different places, there are plugins for this plugin!! -- ( https://github.com/jantimon/html-webpack-plugin#plugins )
             * and can also be used to minify using html-minifier-terser -- ( https://github.com/terser/html-minifier-terser )
             */
            Object.assign(
                {},
                {
                    template: "./src/index.html",
                    inject: true,
                }, isEnvProduction ?
                {
                    /**
                     * minifyJS is applied to the JS inside <script> tag, it is different from terser or swc or esbuild minify.
                     *  -they minify the bundle itself. webpack 5 comes with terser builtin, so unless custom conf is to be provided,
                     *  -no need to add it to plugins.
                     * minifyCSS applies to CSS in <style> tag, not the css files if extracting css ( mini-css-extract-plugin ) is used ( in production ),
                     *  -in dev, style-loader injects css to <style> tag. so it can be minimized if needed.
                     */
                    minify: {
                        collapseWhitespace: true,
                        keepClosingSlash: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                        removeComments: true,
                        removeRedundantAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeEmptyAttributes: true,
                        useShortDoctype: true
                    },
                } : undefined
            )
        ),
        new ForkTsCheckerWebpackPlugin(
            /**
             * To do typescript typechecking during builds
             * STOPS compilation on failed type checks
             * refer to react-dev-utils/ForkTsCheckerWarningWebpackPlugin.js in CRA to 
             * see how to continue compilation on error, 
             * this is a safer option for now, DEFAULTS for now.
             */
            {}
        ),
        new InlineChunkHtmlPlugin(HTMLWebpackPlugin, [/runtime.+[.]js/])
    ],
    /**
     * https://webpack.js.org/configuration/devtool/
     * Refer above link for more options
     * controls source map generation flavours
     * ignore source maps in production
     */
    devtool: isEnvProduction ? false : 'source-map'
};