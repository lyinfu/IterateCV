---
RenderFile: "[[RSMZH1 Default]]"
NewlineHeight:
---

```dataviewjs
const cvRenderPath = app.vault.adapter.basePath + '/990 Supporting/Scripts/render/cvRenderZH.js';
const cvRender = require(cvRenderPath);
var renderer = new cvRender.Renderer(dv);

await dv.view('990 Supporting/Scripts/views/lapisCV');
await dv.view('990 Supporting/Scripts/views/lapisCVPatchZH');


let render_file = dv.current().file.frontmatter.RenderFile;
renderer.newlineHeight = dv.current().file.frontmatter.NewlineHeight;

let allOutlinks = renderer.getAllOutlinks(render_file);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'PRFZH'},
    {'appendNewline': true}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'EMPZH',
     'sectionName': '工作经历'},
    {'appendNewline': true}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'EDUZH',
     'sectionName': '教育经历'},
    {'appendNewline': true}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'AWDZH',
     'sectionName': '获奖经历'},
    {'appendNewline': false}
);

renderer.renderNewline()

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'SKLZH',
     'sectionName': '技能特长'},
    {'appendNewline': false}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'STMZH',
     'sectionName': '自我评价'},
    {'appendNewline': false}
);
```
