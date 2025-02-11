function mergeDicts(...dicts) {
    return Object.assign({}, ...dicts);
}

function checkPrefixMatchFn(include = null, exclude = null, allow_null = true) {
    if (include && exclude) {
        throw new Error('Whitelist and blacklist cannot coexist');
      }
    if (include) {
        include = Array.isArray(include) ? include : [include];
    }
    if (exclude) {
        exclude = Array.isArray(exclude) ? exclude : [exclude];
    }
    return (str) => {
        if (str == null) {
            return allow_null;
        }

        if (include) {
            return include.some(prefix => str.startsWith(prefix));
        }

        if (exclude) {
            return !exclude.some(prefix => str.startsWith(prefix));
        }

        return true;
    };
}

function checkLinkNamePrefixMatchFn(include = null, exclude = null, allow_null = true, allow_hidden=false) {
    // TODO: this is a hack
    return link => checkPrefixMatchFn(include, exclude, allow_null, allow_hidden)(link.display)
}

function matchLinkNamePrefix(link, prefix) {
    // TODO: this is a hack; ensure file
    return link.display.startsWith(prefix);
}


function isHidden(str) {
    // dot will be stripped by dataview; that's why to use dash instead
    return str?.startsWith('-') || false;
}

function isListVisible(list) {
    return !isHidden(list.link.subpath)
}

function toResourceURL(dv, target) {
    if (dv.value.isLink(target)) {
        if (target.type === 'file') {
            return app.vault.adapter.getResourcePath(target.path);
        }
    }
    return target
}

class RendererMixin {
    newlineHeight = null;

    async linkFileExists(link) {
        if (link.type !== 'file') {
            return false;
        }
        return await app.vault.adapter.exists(link.path);
    }

    sortByStartDate() {
        return (a, b) => {
            let pa = this.dv.page(a);
            let pb = this.dv.page(b);
            if (!pa || !pb) {
                return NaN;
            }
            return pb.StartDate - pa.StartDate
        };
    }

    getAllOutlinks(rawLink) {
        return this.dv.page(this.dv.parse(rawLink)).file.outlinks.values
    }

    htmlLeftRight(left, right) {
        return `
        <div style="display: flex; justify-content: space-between;">
            ${left}
            <p style="text-align: right">${right}</p>
        </div>`.trim();
    }

    renderLeftRight(left, right) {
        this.dv.paragraph(this.htmlLeftRight(left, right));
    }

    renderItalicTime(time) {
        return `<i>${time}&nbsp;</i>`
    }

    renderHeaderWithTime(title, time, italic = true) {
        this.renderLeftRight(
            `<h3>${title}</h3>`,
            italic? this.renderItalicTime(time): time)
    }


    renderNewline(height = null) {
        height = height? height : this.newlineHeight;
        if (height != null) {
            this.dv.paragraph(`<div style="line-height:${height}"><br></div>`)
        } else {
            this.dv.paragraph('<br>')
        }
    }

    handleOptionsAppendNewLine(options = {}) {
        const appendNewline = options.appendNewline !== false; // 默认值为 true
        if (appendNewline) {
            this.renderNewline()
        }
    }
}

class Renderer extends RendererMixin {
    static renderStrategies = {};
    // prefix and strategy type match
    static prefixStrategies = {};

    constructor(dv) {
        super()
        this.dv = dv;
    }

    static _registerStrategy(type, strategy) {
        Renderer.renderStrategies[type] = strategy;
    }
    static registerStrategyToPrefix(strategy_type, prefix) {
        Renderer.prefixStrategies[prefix] = strategy_type;
    }

    static registerStrategy(type, strategy, prefix = null) {
        Renderer._registerStrategy(type, strategy);
        if (prefix) {
            Renderer.registerStrategyToPrefix(type, prefix);
        }
    }

    static getStrategyTypeByPrefix(prefix) {
        const type = Renderer.prefixStrategies[prefix];
        if (type == null) {
            throw new Error(`No render strategy found for prefix: ${prefix}`);
        }
        return type
    }

    static getStrategy(type) {
        const strategy = Renderer.renderStrategies[type];
        if (strategy == null) {
            throw new Error(`No render strategy found for prefix: ${type}`);
        }
        return strategy
    }

    static getAllRegisteredPrefixes() {
        return Object.keys(Renderer.prefixStrategies)
    }

    renderPage(type, page, options = {}) {
        const strategy = Renderer.getStrategy(type);
        if (strategy) {
            strategy(page, this.dv, this, options);
        } else {
            throw new Error(`No render strategy found for type: ${type}`);
        }
    }

    renderBatch(args, options = {}) {
        let {
            type = null,
            links = null,
            sectionName= null,
            sort= true,
        } = args;

        if (sectionName) {
            this.dv.header(2, sectionName);
        }
        if (sort) {
            links = links.sort(this.sortByStartDate());
        }
        for (let l of links) {
            const page = this.dv.page(l);
            this.renderPage(type, page, options);
        }
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

        if (sectionName) {
            this.dv.header(2, sectionName);
        }
        if (sort) {
            links = links.sort(this.sortByStartDate());
        }
        if (prefix != null) {
            if (filterByPrefix) {
                links = links.filter(l => matchLinkNamePrefix(l, prefix));
            }
            const type = Renderer.getStrategyTypeByPrefix(prefix);
            for (let l of links) {
                const page = this.dv.page(l);
                this.renderPage(type, page, options);
            }
        } else {
            const all_prefixes = Renderer.getAllRegisteredPrefixes();
            for (let l of links) {
                let found = false;
                for (let p of all_prefixes) {
                    if (matchLinkNamePrefix(l, p)) {
                        const type = Renderer.getStrategyTypeByPrefix(p);
                        const page = this.dv.page(l);
                        this.renderPage(type, page, options);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error(`No renderStrategy registered for link ${l.display}; all registered prefixes: ${all_prefixes}`);
                }
            }
        }
    }
}


function headerListStrategy(page, dv, r, options = {}, defaults={}) {
    let {level=3, upperCase=false, asList=true} = mergeDicts(defaults, options);
    const lists = page.file.lists.filter(isListVisible);
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
    r.handleOptionsAppendNewLine(options)
}


async function rawStrategy(page, dv, r, options = {}) {
    // Be careful when using this
    // Since it is async, it usually finishes later than you thought
    // making it usually get rendered at the end of file.
    // When there are multiple calls, the order is not fixed.
    let content = await dv.io.load(page.file.link);
    dv.paragraph(content);
    r.handleOptionsAppendNewLine(options)
}


// TODO: Normalise namespaces
exports.matchLinkNamePrefix = matchLinkNamePrefix;
exports.checkPrefixMatchFn = checkPrefixMatchFn;
exports.checkLinkNamePrefixMatchFn = checkLinkNamePrefixMatchFn;
exports.isHidden = isHidden;
exports.isListVisible = isListVisible;
exports.toResourceURL = toResourceURL;
exports.headerListStrategy = headerListStrategy;
exports.rawStrategy = rawStrategy;
exports.RendererMixin = RendererMixin;
exports.Renderer = Renderer;
