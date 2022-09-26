module.exports = {
    mode: 'development',
    devServer: {
        static:'./dist'
    },
    module: {
        rules: [
            {
              test: /\.(js|jsx)$/,
              use: ['babel-loader'],
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
            {
              test: /\.scss$/i,
              use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
              test: /\.(png|jpe?g|gif|svg|otf|mp4)$/i,
              use: ['file-loader'],
            },
          ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
}