const rndUtil = require('./util.js');
const Renderer = rndUtil.Renderer;

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

function profileStrategy(page, dv, r, options = {}) {
    dv.paragraph(`<h1>${page.FormalName}</h1>`);
    dv.paragraph(`<center>${page.LinkedIn}&emsp;${page.Mobile}&emsp;${page.Email}<center>`);
    dv.paragraph(`<center>${page.Address}<center>`);
    const contents = page.file.lists.filter(rndUtil.isListVisible);
    dv.paragraph(contents.text);
    r.handleOptionsAppendNewLine(options)
}

function experienceStrategy(page, dv, r, options = {}) {
    const org = page.FormalName;
    const dur = renderDuration(page.StartDate, page.EndDate);
    r.renderHeaderWithTime(org, dur);
    if (page.Position) {
        dv.paragraph(`<b>Position: ${page.Position}</b>`);
    }
    const contents = page.file.lists.filter(rndUtil.isListVisible);
    dv.paragraph(contents.text);
    r.handleOptionsAppendNewLine(options)
}

function educationStrategy(page, dv, r, options = {}) {
    const org = page.FormalName;
    const dur = renderDuration(page.StartDate, page.EndDate);
    r.renderHeaderWithTime(org, dur);
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
        .map(i => quoteComma(i.text))
        .join(', ');
    if (coreCourses) {
        dv.paragraph(`- **Core Modules**: ${coreCourses}`);
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


Renderer.registerStrategy('profileEN', profileStrategy, 'PRFEN');
Renderer.registerStrategy('employmentEN', experienceStrategy, 'EMPEN');
Renderer.registerStrategy('educationEN', educationStrategy, 'EDUEN');
Renderer.registerStrategy('awardEN', awardStrategy, 'AWDEN');
Renderer.registerStrategy('skillEN', skillStrategy, 'SKLEN');
Renderer.registerStrategy('statementEN', statementStrategy, 'STMEN');

exports.Renderer = Renderer;

// TODO: Normalise namespaces
exports.headerListStrategy = rndUtil.headerListStrategy;
exports.checkLinkNamePrefixMatchFn = rndUtil.checkLinkNamePrefixMatchFn;
exports.alterLinks = rndUtil.alterLinks;
