const util = require('../common/util');
const { DVHelper: dh } = require('../common/dvAdaptor');


class NativeRenderer {

    static setNewlineHeight(height) {
        this.newlineHeight = height;
    }

    static renderItalicTime(time) {
        return `<i>${time}&nbsp;</i>`
    }

    static renderHeaderWithTime(title, time, italic = true) {
        this.renderLeftRight(
            `<h3>${title}</h3>`,
            italic? this.renderItalicTime(time): time)
    }

    static htmlLeftRight(left, right) {
        return `
        <div style="display: flex; justify-content: space-between;">
            ${left}
            <p style="text-align: right">${right}</p>
        </div>`.trim();
    }

    static renderLeftRight(left, right) {
        dh.dv.paragraph(this.htmlLeftRight(left, right));
    }

    static renderNewline(height = null) {
        height = height? height : this.newlineHeight;
        if (height != null) {
            dh.dv.paragraph(`<div style="line-height:${height}"><br></div>`)
        } else {
            dh.dv.paragraph('<br>')
        }
    }

    static handleOptionsAppendNewline(options = {}) {
        // default to true
        const appendNewline = options.appendNewline !== false;
        if (appendNewline) {
            this.renderNewline(options.newlineHeight);
        }
    }
    static toResourceURL(target) {
        if (dh.dv.value.isLink(target)) {
            if (target.type === 'file') {
                return app.vault.adapter.getResourcePath(target.path);
            }
        }
        return target
    }
}

function headerListStrategy(block, options = {}, defaults={}) {
    const dv = dh.dv;
    const r = NativeRenderer;
    let {level=3, upperCase=false, asList=true} = util.mergeDicts(defaults, options);
    const lists = block.content;
    var prvHeading = undefined;
    var curHeading = undefined;
    for (let l of lists) {
        if (l.link.type == 'header') {
            curHeading = l.link.subpath;
        }
        if (curHeading !== prvHeading) {
            title = upperCase? curHeading.toUpperCase() : curHeading;
            dv.paragraph(`<h${level}>${title}</h${level}>`);
            prvHeading = curHeading;
        }
        dv.paragraph(asList? [l.text] : l.text);
    }
}


async function rawStrategy(block, options = {}) {
    // Be careful when using this
    // Since it is async, it usually finishes later than you thought
    // making it usually get rendered at the end of file.
    // When there are multiple calls, the order is not fixed.
    const dv = dh.dv;
    const r = NativeRenderer;
    let content = await dv.io.load(block.meta.file.link);
    dv.paragraph(content);
}


module.exports = {
    NativeRenderer,
    headerListStrategy,
    rawStrategy,
}
