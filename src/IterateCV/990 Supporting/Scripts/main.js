const scMgr = require('./scriptManager');

function init(dv) {
    return new scMgr.ScriptManager(dv);
}

module.exports = {
    init
}


try {
    require('./custom');
    console.log('IterateCV: Custom module loaded.');
} catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      console.error('Failed to load custom module:', error);
    }
}
