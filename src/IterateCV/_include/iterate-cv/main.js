const scMgr = require('./scriptManager');
const {setDV} = require('./common/dvAdaptor');

function init(dv) {
    setDV(dv);
    return new scMgr.ScriptManager();
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
