/**
 * webpack的配置文件
 *  作用：指示webpack做什么任务
 *
 * 注意此处要使用cjs的语法，所有构建工具都是基于nodejs平台来运行的
 * 模块化默认采用commonjs
 */

// resolve用于拼接绝对路径
const webpack = require("webpack");
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// 设置nodejs环境变量，package.json中的browserslist是根据NODE_ENV来选择模式的，
// 而不是webpack配置中设置的mode字段
// process.env.NODE_ENV = "development";
const isDev = process.env.NODE_ENV === "development";
const isAnaly = process.env.ANALY === "true";
console.log("environment: ", isDev ? "development" : "production");

// 复用loader
const commonCssLoader = [
  // 创建style标签，将js中的样式资源插入进去，添加到head中生效
  // "style-loader",
  // 提取js中的css成单独的文件，就不需要style-loader了
  // MiniCssExtractPlugin.loader,
  isDev ? "style-loader" : MiniCssExtractPlugin.loader,
  // 将css文件以字符串的形式变成一个cjs的模块，加载到js中
  "css-loader",
  // 使用loader的默认配置，但是如果要修改相关配置的话，就需要使用对象的方式
  // "postcss-loader"
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          [
            "postcss-preset-env",
            {
              ident: "postcss",
            },
          ],
        ],
      },
    },
  },
];

module.exports = {
  // webpack配置
  entry: "./src/index.tsx", // 入口文件
  output: {
    // filename: 'built.[contenthash:6].js',
    filename: "js/[name].[hash:8].js",
    publicPath: "/",
    // __dirname：nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, "../public"),
  },
  resolve: {
    // 支持的脚本后缀名
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "../src/"),
    },
  },
  optimization: {
    runtimeChunk: {
      name: (entrypoint) => `runtime.${entrypoint.name}`,
    },
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](react.*|redux.*)[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        commons: {
          test: /[\\/]node_modules[\\/](?!(react|redux|weixin-js-sdk))/,
          name: "commons",
          chunks: "all",
        },
      },
    },
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      // 详细loader配置
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        loader: "esbuild-loader",
        options: {
          loader: "tsx",
          target: "es2015",
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "esbuild-loader",
        options: {
          loader: "jsx",
          target: "es2015",
        },
      },
      {
        test: /\.css$/,
        // 使用哪些loader进行处理，并且use中执行顺序是从后往前执行
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          // 将less文件编译成css文件，注意还需要下载less包
          "less-loader",
        ],
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: "asset/resource",
        // type: "asset",
        generator: {
          filename: "img/[name].[hash:6][ext]",
        },
        // parser: {
        //   dataurlCondition: {
        //     maxSize: 8192,
        //   },
        // },
        // 如果只使用一个loader，可以直接设置loader字段，不需要再写use字段
        // loader: "url-loader",
        // options: {
        //   // 图片大小小于8Kb，就会被base64处理
        //   // 优点：减少请求数量,  缺点：图片体积会变大，因为变成base64字符串
        //   // 下载url-loader和file-loader
        //   limit: 8 * 1024,
        // },
      },
      // 处理html中img资源
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
      // {
      //   exclude: /\.(css|js|html|jpg|png|gif)$/,
      //   loader: "file-loader",
      // },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "media/[name].[hash:10][ext]",
        },
      },
    ],
  },
  optimization: {
    // 默认情况下只有在production模式下才会开启css压缩
    // 想要在development模式下也开启压缩，需要设置minimize字段为true
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    // 详细plugins配置
    new webpack.ProvidePlugin({
      React: "react",
    }),
    // 用于在每次编译之前清空build目录
    new CleanWebpackPlugin(),
    // 根据模板生成html文件，并能够动态地引入打包生成的所有资源(js/css)
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      // manifest: './public/manifest.json',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: "css/built[hash:6].css",
    }),
    isAnaly ? new BundleAnalyzerPlugin() : { apply: () => {} },
  ],
  mode: "development",
  // mode: 'production'
  // 开发服务器 devServer：用来自动化（自动编译、自动打开浏览器、自动刷新浏览器）
  // 特点：只会在内存中编译打包，而不会有任何输出
  devServer: {
    static: resolve(__dirname, "../public"),
    // 启动gzip压缩，使得代码体积更小
    compress: true,
    port: 3004,
    // 自动打开浏览器
    open: true,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
};
