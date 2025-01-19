const rndUtil = require('./util.js');
const Renderer = rndUtil.Renderer;

const DATE_FORMAT = 'yyyy.MM';

function formatDate(dateTime, fallback = 'n.d.') {
    return dateTime ? dateTime.toFormat(DATE_FORMAT) : fallback;
}

function renderDuration(startDate, endDate) {
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate, '至今');
    return `${startStr} - ${endStr}`;
}

function profileStrategy(page, dv, r, options = {}) {
    dv.paragraph('<br>');
    dv.paragraph(`<h1>${page.FormalName}</h1>`);
    let line1 = [page.Gender, page.Birth, page.LinkedIn].filter(x => x);
    if (line1) {
        dv.paragraph(`<center>${line1.join('&emsp;&emsp;')}<center>`);
    };
    let line2 = [page.Mobile, page.Email].filter(x => x);
    if (line2) {
        dv.paragraph(`<center>${line2.join('&emsp;&emsp;')}<center>`);
    };
    if (page.Avatar) {
        url = rndUtil.toResourceURL(dv, page.Avatar);
        dv.paragraph(`<img src="${url}" alt="avatar">`);
    };
    const contents = page.file.lists.filter(rndUtil.isListVisible);
    dv.paragraph(contents.text);
    r.handleOptionsAppendNewLine(options)
}


function experienceStrategy(page, dv, r, options = {}) {
    const org = page.FormalName;
    const dur = renderDuration(page.StartDate, page.EndDate);
    r.renderHeaderWithTime(org, dur, false);
    if (page.Position) {
        dv.paragraph(`<b>职位: ${page.Position}</b>`);
    }
    const contents = page.file.lists.filter(rndUtil.isListVisible);
    dv.paragraph(contents.text);
    r.handleOptionsAppendNewLine(options)
}

function educationStrategy(page, dv, r, options = {}) {
    const org = page.FormalName;
    const dur = renderDuration(page.StartDate, page.EndDate);
    r.renderHeaderWithTime(org, dur, false);
    dv.paragraph(page.Degree);
    if (page.Result) {
        if (page.ResultType) {
            dv.paragraph(`- **${page.ResultType}**: ${page.Result}`);
        } else {
            dv.paragraph(`- ${page.Result}`);
        }
    }
    const otherStatements = page.file.lists.filter(
        l => l.link.subpath !== 'Core Modules' && rndUtil.isListVisible(l)
    );
    dv.paragraph(otherStatements.text);
    const coreCourses = page.file.lists
        .filter(l => l.link.subpath === 'Core Modules')
        .text
        .join('、');
    if (coreCourses) {
        dv.paragraph(`- **核心课程**: ${coreCourses}`);
    }
    r.handleOptionsAppendNewLine(options)
}

function awardStrategy(page, dv, r, options = {}) {
    rndUtil.headerListStrategy(page, dv, r, options, {'asList': false});
}


function skillStrategy(page, dv, r, options = {}) {
    rndUtil.headerListStrategy(page, dv, r, options, {'asList': true})
}


function statementStrategy(page, dv, r, options = {}) {
    rndUtil.headerListStrategy(page, dv, r, options, {'asList': false})
}


Renderer.registerStrategy('profileZH', profileStrategy, 'PRFZH');
Renderer.registerStrategy('employmentZH', experienceStrategy, 'EMPZH');
Renderer.registerStrategy('educationZH', educationStrategy, 'EDUZH');
Renderer.registerStrategy('awardZH', awardStrategy, 'AWDZH');
Renderer.registerStrategy('skillZH', skillStrategy, 'SKLZH');
Renderer.registerStrategy('summaryZH', statementStrategy, 'STMZH');

exports.Renderer = Renderer;


// TODO: Normalise namespaces
exports.headerListStrategy = rndUtil.headerListStrategy;
exports.checkLinkNamePrefixMatchFn = rndUtil.checkLinkNamePrefixMatchFn;
exports.alterLinks = rndUtil.alterLinks;
