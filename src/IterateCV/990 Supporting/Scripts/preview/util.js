
async function render_dql(dv, dql) {
    // there is an issue with `dv.execute(dql)`
    // https://github.com/blacksmithgu/obsidian-dataview/issues/2092
    // TODO: check type and try/catch
    var rst = await dv.tryQuery(dql);
    dv.table(rst.headers, rst.values);
}

exports.render_dql = render_dql;
