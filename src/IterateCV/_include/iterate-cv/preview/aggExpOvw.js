// TODO: relative import to reuse the code
async function render_dql(dv, dql) {
    // there is an issue with `dv.execute(dql)`
    // https://github.com/blacksmithgu/obsidian-dataview/issues/2092
    // TODO: check type and try/catch
    var rst = await dv.tryQuery(dql);
    dv.table(rst.headers, rst.values);
}

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
    await render_dql(dv, dqlMain);
}

await prvRender(dv);
