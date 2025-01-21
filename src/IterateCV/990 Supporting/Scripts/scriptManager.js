const path = require('path');
const currentFolder = __dirname;
const vaultPath = app.vault.adapter.basePath;


function normalizePath(p) {
    // relative paths that Dataview accepts are always in Unix format
    if (path.sep == '\\') {
        return p.replace(/\\/g, '/');
    }
    return p;
}

function scriptsDirFull() {
  return currentFolder;
}

function scriptsDirRelative() {
    return normalizePath(path.relative(vaultPath, scriptsDirFull()));
}

function subpathRelativeToVault(subPath) {
    return normalizePath(path.join(scriptsDirRelative(), subPath));
}


class ScriptManager {
    constructor(dv) {
        this.dv = dv;
    }

    subpathRelativeToVault = subpathRelativeToVault;

    get scriptsDirFull() {
        return scriptsDirFull();
    }

    get scriptsDirRelative() {
        return scriptsDirRelative();
    }

    getAllOutlinks(rawLink) {
        return this.dv.page(this.dv.parse(rawLink)).file.outlinks.values
    }

    async loadView(viewPath) {
        return await this.dv.view(this.subpathRelativeToVault(viewPath));
    }

    initRenderer(renderModule) {
        let mod = require(path.join(this.scriptsDirFull, renderModule));
        return new mod.Renderer(this.dv);
    }

    get frontmatter() {
        return this.dv.current().file.frontmatter;
    }

    get fm() {
        return this.frontmatter;
    }

}

module.exports = {
    ScriptManager,
    scriptsDirFull,
    scriptsDirRelative,
    subpathRelativeToVault
}
