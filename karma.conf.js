module.exports = function (config) {
    config.set({
        basePath: './',
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'dist/saucer-easter-egg.jquery.js',
            'spec/support/saucer-easter-egg.jquery.spec.js',
            
        ],
        debug: true,
        autoWatch: true,
        frameworks: [
            'jasmine'],
        plugins: [
            'karma-jasmine',
            'jasmine',
            'jasmine-core',
            'karma-chrome-launcher'
        ],
        browsers: ['Chrome'],
       // logLevel: config.LOG_DEBUG,

//  npm install -g karma karma-chrome-launcher karma-jasmine jasmine --save-dev

    });
};
