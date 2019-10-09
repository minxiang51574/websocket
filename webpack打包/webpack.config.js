/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-06 11:43:15
 * @LastEditTime: 2019-09-06 14:11:50
 * @LastEditors: Please set LastEditors
 */
var webpack = require('webpack');

var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin'); //打包html的插件
var UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //打包html的插件

module.exports = {

     entry:{
         'app/dist/js/index':'./app/src/js/index.js'  //入口文件

         //我们的是多页面项目，多页面入口配置就是这样，
         //app/src/page下可能还会有很多页面，照着这样配置就行

     },
     output:{
          //__dirname 当前webpack.config.js的路径
          filename: '[name].js',      //打包后index.js的名字，
                                     // 这个[name]的意思是,配置入口entry键值对里的key值,app/dist/js/index,最后的index，
                                     //这里无论你src/js/index.js这个脚本如何命名，打包后都将是index.js
        //   path: path.resolve(__dirname)
     },
     module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    //  loaders: [{
    //   test: /\.js$/, //处理以.js结尾的文件
    //   exclude: /node_modules/, //处理除了nodde_modules里的js文件
    //   loader: 'babel-loader' //用babel-loader处理
    // }],


     //插件
     plugins:[
        new HtmlWebpackPlugin({
            chunks:['app/dist/js/index'],
            filename:'app/index.html',
            template:'app/src/page/index.html'  
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                // warnings: false,
                drop_debugger: true,  //去掉debugger
                drop_console: true,  // 去掉console
                pure_funcs: ['console.log']// 移除console
              }
            },
            // sourceMap: config.build.productionSourceMap,
            parallel: true
        })
     ]
}