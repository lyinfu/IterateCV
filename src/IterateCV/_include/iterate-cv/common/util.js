const pathlib = require('path');
const { DVHelper: dh } = require('../common/dvAdaptor');


function mergeDicts(...dicts) {
    return Object.assign({}, ...dicts);
}

function parseBlockType(blockId) {
    const match = blockId.match(/([a-zA-Z]+)\d+/);
    return match ? match[1] : null;
}

function parseBlockId(title) {
    title = title || '';
    return title.split(' ')[0];
}

function isHidden(str) {
    // dot will be stripped by dataview; that's why to use dash instead
    return str?.startsWith('-') || false;
}

function isListVisible(list) {
    return !isHidden(list.link.subpath)
}

function getFileLinkName(link) {
    const dv = dh.dv;
    if (dv.value.isLink(link)) {
        if (link.type !== 'file') {
            throw new Error(`${link} is not a file link`);
        }
        if (link.display) {
            return link.display;
        } else {
            return pathlib.parse(link.path).name;
        }
    } else if (typeof link === 'string'){
        return getFileLinkName(dv.parse(link));
    } else {
        throw new Error(`NotImplemented for ${link}`)
    }
}

function sortBlockDate(metaA, metaB) {
    if (!metaA || !metaB) {
        return NaN;
    }
    if ('StartDate' in metaA || 'StartDate' in metaB) {
        return metaB.StartDate - metaA.StartDate;
    }
     if ('EventDate' in metaA || 'EventDate' in metaB) {
         return metaB.EventDate - metaA.EventDate;
     }
    return NaN;
}


module.exports = {
    mergeDicts,
    parseBlockType,
    parseBlockId,
    isHidden,
    isListVisible,
    getFileLinkName,
    sortBlockDate,
}
