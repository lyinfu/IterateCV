---
RenderFile: "[[RSMZH1 Default]]"
NewlineHeight:
---

```dataviewjs
const scriptsDir = app.vault.adapter.basePath + '/990 Supporting/Scripts';
const main = require(scriptsDir + '/main.js');
let mgr = main.init(dv);

await mgr.loadView('views/lapisCV');
await mgr.loadView('views/lapisCVPatchZH');

let rndr = mgr.initRenderer('render/cvRenderZH');
rndr.newlineHeight = mgr.fm.NewlineHeight;

let allOutlinks = mgr.getAllOutlinks(mgr.fm.RenderFile);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'PRFZH'},
    {'appendNewline': true}
);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'EMPZH',
     'sectionName': '工作经历'},
    {'appendNewline': true}
);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'EDUZH',
     'sectionName': '教育经历'},
    {'appendNewline': true}
);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'AWDZH',
     'sectionName': '获奖经历'},
    {'appendNewline': false}
);

rndr.renderNewline()

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'SKLZH',
     'sectionName': '技能特长'},
    {'appendNewline': false}
);

rndr.renderBatchByPrefix(
    {'links': allOutlinks,
     'prefix': 'STMZH',
     'sectionName': '自我评价'},
    {'appendNewline': false}
);
```
