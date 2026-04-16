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

let tpl = mgr.getTemplate('template/en1');
await tpl.processRawLink(mgr.fm.RenderFile, {'newlineHeight': mgr.fm.NewlineHeight})

```
