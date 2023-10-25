const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


const isEnvProduction = false;

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
                use: ["style-loader", "css-loader"]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
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
        )
    ]
};