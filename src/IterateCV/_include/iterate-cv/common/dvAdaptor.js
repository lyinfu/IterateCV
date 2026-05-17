var _dv;
var _initialized = false;

function setDV(dv) {
    _dv = dv;
    _initialized = true;
}

class DVHelper {
    // you should call this inside a function
    // to delay the access to `dv` until it's actually set
    static get dv() {
        if (!_initialized) {
            throw new Error('DVHelper: dv is not set');
        }
        return _dv;
    }
}


module.exports = {
    setDV,
    DVHelper,
}
