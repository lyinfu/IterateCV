---
RenderFile: "[[RSMEN2 Modified]]"
NewlineHeight: 90%
---

```dataviewjs
const cvRenderPath = app.vault.adapter.basePath + '/990 Supporting/Scripts/render/cvRenderEN.js';
const cvRender = require(cvRenderPath);
var renderer = new cvRender.Renderer(dv);

await dv.view('990 Supporting/Scripts/views/lapisCV');
await dv.view('990 Supporting/Scripts/views/lapisCVPatchEN');


let render_file = dv.current().file.frontmatter.RenderFile;
renderer.newlineHeight = dv.current().file.frontmatter.NewlineHeight;

let allOutlinks = renderer.getAllOutlinks(render_file);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'PRFEN'},
    {'appendNewline': true}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'STMEN',
     'sectionName': 'PERSONAL STATEMENT'},
    {'appendNewline': true}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'EMPEN',
     'sectionName': 'PROFESSIONAL EXPERIENCE'},
    {'appendNewline': true}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'EDUEN',
     'sectionName': 'EDUCATION'},
    {'appendNewline': true}
);

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'AWDEN',
     'sectionName': 'ACTIVITIES AND ACHIEVEMENTS'},
    {'appendNewline': false}
);

renderer.renderNewline()

renderer.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'SKLEN',
     'sectionName': 'SKILLS AND PROFICIENCY'},
    {'appendNewline': false}
);
```
