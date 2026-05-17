let targetFolder = dv.current().file.folder
let prefix = dv.current().file.name.split(' ')[0]
let pages = dv.pages('"' + targetFolder + '"')
    .where(
        p => p.file.name.startsWith(prefix) &
        p.file.name != dv.current().file.name
    )
    .sort(p => p.file.ctime, 'asc')
let data = [];
for (let p of pages) {
    data.push([
        dv.paragraph(dv.fileLink(p.file.name)),
        dv.paragraph(dv.fileLink(p.file.name, true))
    ])
}
dv.table(['Meta', 'Content'], data);
