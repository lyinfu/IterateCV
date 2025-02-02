// TODO: relative import to reuse the code
async function render_dql(dv, dql) {
    // there is an issue with `dv.execute(dql)`
    // https://github.com/blacksmithgu/obsidian-dataview/issues/2092
    // TODO: check type and try/catch
    var rst = await dv.tryQuery(dql);
    dv.table(rst.headers, rst.values);
}

const dqlEmp = `
TABLE WITHOUT ID
    join([
        file.link,
        "---",
        choice(
            Duration,
            Duration,
            choice(
                StartDate,
                choice(
                    EndDate,
                    dateformat(StartDate, "MMM. yyyy") + " - " + dateformat(EndDate, "MMM. yyyy"),
                    dateformat(StartDate, "MMM. yyyy") + " - Present"
                ),
                "n.d."
            )
        ),
        Position
        ], "<br>") AS "Overview",
    filter(file.lists, (x) => (choice(meta(x.link).subpath, !startswith(meta(x.link).subpath, "-"), true))).text AS "Content"
FROM outgoing([[]])
WHERE regexmatch("EMP.*", file.name)
SORT file.frontmatter["StartDate"] DESC
`.trim();

const dqlEdu = `
TABLE WITHOUT ID
    join([
        file.link,
        "---",
        choice(
            Duration,
            Duration,
            choice(
                StartDate,
                choice(
                    EndDate,
                    dateformat(StartDate, "MMM. yyyy") + " - " + dateformat(EndDate, "MMM. yyyy"),
                    dateformat(StartDate, "MMM. yyyy") + " - Present"
                ),
                "n.d."
            )
        ),
        Major
        ], "<br>") AS "Overview",
    filter(file.lists, (x) => (choice(meta(x.link).subpath, !startswith(meta(x.link).subpath, "-"), true))).text AS "Content"
FROM outgoing([[]])
WHERE regexmatch("EDU.*", file.name)
SORT file.frontmatter["StartDate"] DESC
`.trim();

const dqlAwd = `
TABLE WITHOUT ID
    join([file.link,
          dateformat(EventDate, "MMM. yyyy")
          ], "<br>") AS "Overview",
    filter(file.lists, (x) => (choice(meta(x.link).subpath, !startswith(meta(x.link).subpath, "-"), true))).text AS "Content"
FROM outgoing([[]])
WHERE regexmatch("AWD.*", file.name)
SORT file.frontmatter["EventDate"] DESC
`.trim();

const dqlSkl = `
TABLE WITHOUT ID
    file.lists.header AS Overview,
    filter(file.lists, (x) => (choice(meta(x.link).subpath, !startswith(meta(x.link).subpath, "-"), true))).text AS "Content"
FROM outgoing([[]])
WHERE regexmatch("SKL.*", file.name)
SORT Item DESC
`.trim();

const dqlStm = `
TABLE WITHOUT ID
    file.link AS Overview,
    filter(file.lists, (x) => (choice(meta(x.link).subpath, !startswith(meta(x.link).subpath, "-"), true))).text AS "Content"
FROM outgoing([[]])
WHERE regexmatch("STM.*", file.name)
SORT Item DESC
`.trim();


async function prvRender(dv) {
    dv.header(2, 'Professional Experience');
    await render_dql(dv, dqlEmp);
    dv.header(2, 'Education');
    await render_dql(dv, dqlEdu);
    dv.header(2, 'Activities and Achievements');
    await render_dql(dv, dqlAwd);
    dv.header(2, 'Skills');
    await render_dql(dv, dqlSkl);
    dv.header(2, 'Persoanl Statement');
    await render_dql(dv, dqlStm);
}

await prvRender(dv);
