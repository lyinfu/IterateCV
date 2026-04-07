const base = require('../common/base');
const nr = require('../render/native');
const { DVHelper: dh } = require('../common/dvAdaptor');

console.warn('IterateCV: Module legacy.render is for backwards compatibility only. Please migrate to the new template format.');

function matchLinkNamePrefix(link, prefix) {
    // this is a hack
    return link.display.startsWith(prefix);
}

class LegacyRenderer {

    constructor(template) {
        this.template = template;
    }

    renderBatchByPrefix(
        args = {},
        options = {}
    ) {
        let {
            links = null,
            prefix = null,
            sectionName= null,
            sort= true,
            filterByPrefix= true
        } = args;

        if (sort) {
            links = links.sort((a, b) => base.sortBlockDate(dh.dv.page(a), dh.dv.page(b)));
        }
        if (prefix != null) {
            if (filterByPrefix) {
                links = links.filter(l => matchLinkNamePrefix(l, prefix));
            }
        }
        const blocks = links.map(l => this.template.blockFactory.fromLink(l));
        const section = new base.Section(sectionName, blocks, options);
        const pageSpec = new base.PageSpec([section]);
        this.template.process(pageSpec, options);
        nr.NativeRenderer.handleOptionsAppendNewline(options);
    }

    renderNewline = nr.NativeRenderer.renderNewline;
}

module.exports = {
    LegacyRenderer: LegacyRenderer
}
