// TODO: relative import
const prvUtilPath = '/990 Supporting/Scripts/preview/util.js';
const prvUtil = require(app.vault.adapter.basePath + prvUtilPath);

const dqlMain = `
TABLE WITHOUT ID
join([
    file.link,
    "---",
    sort(file.inlinks),
    "---"
], "<br>") AS "Overview",
filter(file.lists, (x) => (choice(meta(x.link).subpath, !startswith(meta(x.link).subpath, "-"), true))).text AS "Content"
FROM "600 Elements"
WHERE regexmatch(this.file.name + ".+", file.name)
SORT file.ctime ASC
`.trim();

async function prvRender(dv) {
    await prvUtil.render_dql(dv, dqlMain);
}

await prvRender(dv);
