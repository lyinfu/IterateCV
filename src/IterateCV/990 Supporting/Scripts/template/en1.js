const base = require('../common/base');
const nr = require('../render/native');
const { DVHelper: dh } = require('../common/dvAdaptor');

const DATE_FORMAT = 'MMM. yyyy';

function formatDate(dateTime, fallback = 'n.d.') {
    return dateTime ? dateTime.toFormat(DATE_FORMAT) : fallback;
}

function renderDuration(startDate, endDate) {
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate, 'Present');
    return `${startStr} - ${endStr}`;
}

function quoteComma(t) {
    return (t?.includes(',') ? `“${t}”` : t);
}

class ProfileBlock extends base.MdBlock {
    static type = 'PRFEN';
}

class ProfileNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        const dv = dh.dv;
        const r = nr.NativeRenderer;
        const bm = block.meta;
        dv.paragraph(`<h1>${bm.FormalName}</h1>`);
        const contactLine = [bm.LinkedIn, bm.Mobile, bm.Email].filter(Boolean).join('&emsp;');
        if (contactLine.length > 0) {
            dv.paragraph(`<center>${contactLine}</center>`);
        }
        if (bm.Address) {
            dv.paragraph(`<center>${bm.Address}</center>`);
        }
        dv.paragraph(block.content.text);
    }
}

class StatementBlock extends base.MdBlock {
    static type = 'STMEN';
}

class StatementNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        return nr.headerListStrategy(block, options, {'asList': false});
    }
}

class ExperienceBlock extends base.MdBlock {
    static type = 'EMPEN';
}

class ExperienceNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        const bm = block.meta;
        const dv = dh.dv;
        const r = nr.NativeRenderer;
        const org = bm.FormalName;
        const dur = renderDuration(bm.StartDate, bm.EndDate);
        r.renderHeaderWithTime(org, dur);
        if (bm.Position) {
            dv.paragraph(`<b>Position: ${bm.Position}</b>`);
        }
        dv.paragraph(block.content.text);
    }
}

class EducationBlock extends base.MdBlock {
    static type = 'EDUEN';
}

class EducationNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        const bm = block.meta;
        const dv = dh.dv;
        const r = nr.NativeRenderer;
        const org = bm.FormalName;
        const dur = renderDuration(bm.StartDate, bm.EndDate);
        r.renderHeaderWithTime(org, dur);
        dv.paragraph(bm.Degree);
        if (bm.Result) {
            if (bm.ResultType) {
                dv.paragraph(`- **${bm.ResultType}**: ${bm.Result}`);
            } else {
                dv.paragraph(`- ${bm.Result}`);
            }
        }
        const otherStatements = bm.file.lists.filter(
            l => l.link.subpath !== 'Core Modules' && base.isListVisible(l)
        );
        dv.paragraph(otherStatements.text);
        const coreCourses = bm.file.lists
            .filter(l => l.link.subpath === 'Core Modules')
            .map(i => quoteComma(i.text))
            .join(', ');
        if (coreCourses) {
            dv.paragraph(`- **Core Modules**: ${coreCourses}`);
        }
    }
}

class AwardBlock extends base.MdBlock {
    static type = 'AWDEN';
}

class AwardNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        return nr.headerListStrategy(block, options, {'asList': false});
    }
}

class SkillBlock extends base.MdBlock {
    static type = 'SKLEN';
}

class SkillNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        return nr.headerListStrategy(block, options, {'asList': true});
    }
}


class Template extends base.Template {
    register() {
        this.registerBlockFormatter(EducationBlock, EducationNativeFormatter);
        this.registerBlockFormatter(ProfileBlock, ProfileNativeFormatter);
        this.registerBlockFormatter(StatementBlock, StatementNativeFormatter);
        this.registerBlockFormatter(ExperienceBlock, ExperienceNativeFormatter);
        this.registerBlockFormatter(AwardBlock, AwardNativeFormatter);
        this.registerBlockFormatter(SkillBlock, SkillNativeFormatter);
    }

    async processRawLink(rawLink, pageOptions = {}) {
        const pageSpec = await base.MdPageSpec.fromRawLink(
            rawLink, this.blockFactory
        );
        this.process(pageSpec, pageOptions);
    }

    process(pageSpec, pageOptions = {}) {
        const r = nr.NativeRenderer;
        for (const section of pageSpec.data) {
            if (section.title) {
                dh.dv.header(2, section.title);
            }
            for (const block of section.blocks) {
                const formatterClass = this.blockFormatterRegistry.getByBlock(block);
                const mergedOptions = {...pageOptions, ...section.options};
                formatterClass.toFormat(block, mergedOptions);
                const isLastBlock = block === section.blocks[section.blocks.length - 1];
                if (!isLastBlock) {
                    r.handleOptionsAppendNewline(mergedOptions);
                }
            }
            const isLastSection = section === pageSpec.data[pageSpec.data.length - 1];
            if (!isLastSection) {
                r.handleOptionsAppendNewline(pageOptions);
            }
        }
    }
}

module.exports = {
    Template,
    ProfileNativeFormatter,
    ExperienceNativeFormatter,
    EducationNativeFormatter
}
