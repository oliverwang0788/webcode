/**
 * Created by oliver on 16/12/10.
 */
var register = require('babel-core/register');

register({
    presets: ['stage-3']
});

require('./app.js');