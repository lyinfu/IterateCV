const base = require('../common/base');
const nr = require('../render/native');
const { DVHelper: dh } = require('../common/dvAdaptor');

const DATE_FORMAT = 'yyyy.MM';

function formatDate(dateTime, fallback = 'n.d.') {
    return dateTime ? dateTime.toFormat(DATE_FORMAT) : fallback;
}

function renderDuration(startDate, endDate) {
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate, '至今');
    return `${startStr} - ${endStr}`;
}

class ProfileBlock extends base.MdBlock {
    static type = 'PRFZH';
}

class ProfileNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        const dv = dh.dv;
        const r = nr.NativeRenderer;
        const bm = block.meta;
        dv.paragraph('<br>');
        dv.paragraph(`<h1>${bm.FormalName}</h1>`);
        let line1 = [bm.Gender, bm.Birth, bm.LinkedIn].filter(x => x);
        if (line1) {
            dv.paragraph(`<center>${line1.join('&emsp;&emsp;')}<center>`);
        }
        let line2 = [bm.Mobile, bm.Email].filter(x => x);
        if (line2) {
            dv.paragraph(`<center>${line2.join('&emsp;&emsp;')}<center>`);
        }
        if (bm.Avatar) {
            const url = r.toResourceURL(bm.Avatar);
            dv.paragraph(`<img src="${url}" alt="avatar">`);
        }
        dv.paragraph(block.content.text);
    }
}

class StatementBlock extends base.MdBlock {
    static type = 'STMZH';
}

class StatementNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        return nr.headerListStrategy(block, options, {'asList': false});
    }
}

class ExperienceBlock extends base.MdBlock {
    static type = 'EMPZH';
}

class ExperienceNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        const dv = dh.dv;
        const r = nr.NativeRenderer;
        const bm = block.meta;
        const org = bm.FormalName;
        const dur = renderDuration(bm.StartDate, bm.EndDate);
        r.renderHeaderWithTime(org, dur, false);
        if (bm.Position) {
            dv.paragraph(`<b>职位: ${bm.Position}</b>`);
        }
        dv.paragraph(block.content.text);
    }
}

class EducationBlock extends base.MdBlock {
    static type = 'EDUZH';
}

class EducationNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        const bm = block.meta;
        const dv = dh.dv;
        const r = nr.NativeRenderer;
        const org = bm.FormalName;
        const dur = renderDuration(bm.StartDate, bm.EndDate);
        r.renderHeaderWithTime(org, dur, false);
        dv.paragraph(bm.Degree);
        if (bm.Result) {
            if (bm.ResultType) {
                dv.paragraph(`- **${bm.ResultType}**: ${bm.Result}`);
            } else {
                dv.paragraph(`- ${bm.Result}`);
            }
        }
        const otherStatements = bm.file.lists.filter(
            l => l.link.subpath !== 'Core Modules' && nr.isListVisible(l)
        );
        dv.paragraph(otherStatements.text);
        const coreCourses = bm.file.lists
            .filter(l => l.link.subpath === 'Core Modules')
            .text
            .join('、');
        if (coreCourses) {
            dv.paragraph(`- **核心课程**: ${coreCourses}`);
        }
    }
}

class AwardBlock extends base.MdBlock {
    static type = 'AWDZH';
}

class AwardNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        return nr.headerListStrategy(block, options, {'asList': false});
    }
}

class SkillBlock extends base.MdBlock {
    static type = 'SKLZH';
}

class SkillNativeFormatter extends base.BlockFormatter {
    static toFormat(block, options = {}) {
        return nr.headerListStrategy(block, options, {'asList': true});
    }
}

class Template extends base.Template {
    register() {
        this.registerBlockFormatter(ProfileBlock, ProfileNativeFormatter);
        this.registerBlockFormatter(StatementBlock, StatementNativeFormatter);
        this.registerBlockFormatter(ExperienceBlock, ExperienceNativeFormatter);
        this.registerBlockFormatter(EducationBlock, EducationNativeFormatter);
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
