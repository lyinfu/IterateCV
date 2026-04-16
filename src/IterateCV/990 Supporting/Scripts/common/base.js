const { DVHelper: dh } = require('../common/dvAdaptor');

class Block {
    constructor(data) {
        this.data = data;
    }

    get id() {
        throw new Error("Not implemented");
    }

    get type() {
        throw new Error("Not implemented");
    }

    get meta() {
        throw new Error("Not implemented");
    }

    get content() {
        throw new Error("Not implemented");
    }

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

class MdBlock extends Block {
    static type = null;

    get id() {
        return parseBlockId(this.data.file.name);
    }

    get type() {
        return this.constructor.type ?? parseBlockType(this.id);
    }

    get meta() {
        return this.data;
    }

    get content() {
        var lists = this.data.file.lists.filter(isListVisible);
        return lists;
    }

    static fromPage(page) {
        return new this(page);
    }
}

class BlockClassRegistry {
    constructor() {
        this.registry = new Map();
    }

    register(blockClass) {
        const type = blockClass.type;
        if (!type) {
            throw new Error(`${blockClass.name} missing static type`);
        }
        this.registry.set(type, blockClass);
    }

    get(type) {
        return this.registry.get(type);
    }

    resolveByPage(page, fallback = MdBlock) {
        const id = parseBlockId(page.file.name);
        const type = parseBlockType(id);
        return this.registry.get(type) || fallback;
    }
}


class BlockFactory {
    constructor(blockClassRegistry, fallback = MdBlock) {
        this.blockClassRegistry = blockClassRegistry;
        this.fallback = fallback;
    }

    fromPage(page) {
        const blockCls = this.blockClassRegistry.resolveByPage(page, this.fallback);
        return blockCls.fromPage(page);
    }

    fromLink(link) {
        const page = dh.dv.page(link);
        return this.fromPage(page);
    }

}

class BlockFormatter {
    static toFormat(block, options = {}) {
        throw new Error('Not implemented');
    }
}


class BlockFormatterRegistry {
    constructor() {
        this.registry = new Map();
    }

    register(blockCls, formatterCls) {
        if (this.registry.has(blockCls)) {
            console.warn(`Overwriting formatter for type: ${blockCls.name}`);
        }
        this.registry.set(blockCls, formatterCls);
    }

    get(blockCls) {
        const formatterClass = this.registry.get(blockCls);
        if (!formatterClass) {
            throw new Error(`No formatter registered for block class: ${blockCls.name}`);
        }
        return formatterClass;
    }

    getByBlock(block) {
        return this.get(block.constructor);
    }
}


class Section {
    constructor(title, blocks, options = {}) {
        this.title = title;
        this.blocks = blocks;
        this.options = options;
    }
}


function parseLinkGrouping(text, filterEmpty = true) {
    const lines = text.split("\n");

    const groups = [];
    let currentHeading = null;
    let currentLevel = null;

    for (const line of lines) {
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
                currentLevel = headingMatch[1].length;
                currentHeading = headingMatch[2].trim();
                groups.push({
                    heading: currentHeading,
                    level: currentLevel,
                    links: []
            });
            continue;
        }

        if (!currentHeading) continue;

        const linkMatches = [...line.matchAll(/\[\[([^\]]+)\]\]/g)];
        if (linkMatches.length > 0) {
            const currentGroup = groups[groups.length - 1];
            for (const match of linkMatches) {
                currentGroup.links.push(match[1].trim());
            }
        }
    }

    if (filterEmpty) {
        return groups.filter(group => group.links.length > 0);
    }

    return groups;

}

class MdSection extends Section {

    static parser = parseLinkGrouping;
    static sortFn = sortBlockDate;

    static async fromRawLink(rawLink, blockFactory) {
        const dv = dh.dv;
        const p = dv.page(dv.parse(rawLink));
        const content = await dv.io.load(p.file.link);

        const groups = this.parser(content);
        let sections = [];
        for (const g of groups) {
            let sectionName = null;
            let options = {};
            if (g['heading'] !== null && g['heading'].startsWith('0x')) {
                sectionName = p[(g['heading'])];
                options = p[(g['heading'] + '.options')];
                options = options ? JSON.parse(options) : {};
            } else {
                sectionName = g['heading'];
            }
            let blocks = g['links'].map(l => blockFactory.fromLink(l));
            if (typeof this.sortFn === 'function') {
                blocks = blocks.sort((a, b) => this.sortFn(a.meta, b.meta));
            }
            sections.push(new this(sectionName, blocks, options));
        }
        return sections;
    }
}

class PageSpec {

    constructor(data) {
        this.data = data;
    }
}

class MdPageSpec extends PageSpec {

    static async fromRawLink(rawLink, blockFactory) {
        return new this(await MdSection.fromRawLink(rawLink, blockFactory));
    }
}


class Template {
    constructor() {
        this.blockRegistry = new BlockClassRegistry();
        this.blockFactory = new BlockFactory(this.blockRegistry);
        this.blockFormatterRegistry = new BlockFormatterRegistry();
        this.register();
    }
    register() {}
    registerBlockFormatter(blockCls, formatterCls) {
        this.blockRegistry.register(blockCls);
        this.blockFormatterRegistry.register(blockCls, formatterCls);
    }
}

module.exports = {
    Template,
    PageSpec,
    MdPageSpec,
    Section,
    MdSection,
    Block,
    MdBlock,
    BlockFormatter,
    BlockFormatterRegistry,
    isListVisible,
    parseBlockType,
    parseLinkGrouping,
    sortBlockDate
}
