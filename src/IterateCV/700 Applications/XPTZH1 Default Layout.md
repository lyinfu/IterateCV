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

let tpl = mgr.getTemplate('template/zh1');
await tpl.processRawLink(mgr.fm.RenderFile, {'newlineHeight': mgr.fm.NewlineHeight})

```
