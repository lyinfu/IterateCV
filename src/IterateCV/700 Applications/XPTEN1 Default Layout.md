---
RenderFile: "[[RSMEN2 Modified]]"
NewlineHeight: 90%
---

```dataviewjs
const scriptsDir = app.vault.adapter.basePath + '/990 Supporting/Scripts';
const main = require(scriptsDir + '/main.js');
let mgr = main.init(dv);

await mgr.loadView('views/lapisCV');
await mgr.loadView('views/lapisCVPatchEN');

let rndr = mgr.initRenderer('render/cvRenderEN');
rndr.newlineHeight = mgr.fm.NewlineHeight;

let allOutlinks = mgr.getAllOutlinks(mgr.fm.RenderFile);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'PRFEN'},
    {'appendNewline': true}
);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'STMEN',
     'sectionName': 'PERSONAL STATEMENT'},
    {'appendNewline': true}
);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'EMPEN',
     'sectionName': 'PROFESSIONAL EXPERIENCE'},
    {'appendNewline': true}
);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'EDUEN',
     'sectionName': 'EDUCATION'},
    {'appendNewline': true}
);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'AWDEN',
     'sectionName': 'ACTIVITIES AND ACHIEVEMENTS'},
    {'appendNewline': false}
);

rndr.renderNewline()

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'SKLEN',
     'sectionName': 'SKILLS AND PROFICIENCY'},
    {'appendNewline': false}
);
```
