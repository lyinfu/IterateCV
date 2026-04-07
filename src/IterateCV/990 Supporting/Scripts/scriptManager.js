const path = require('path');
const currentFolder = __dirname;
const vaultPath = app.vault.adapter.basePath;
const { DVHelper: dh } = require('./common/dvAdaptor');


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

    subpathRelativeToVault = subpathRelativeToVault;

    get scriptsDirFull() {
        return scriptsDirFull();
    }

    get scriptsDirRelative() {
        return scriptsDirRelative();
    }

    getAllOutlinks(rawLink) {
        return dh.dv.page(dh.dv.parse(rawLink)).file.outlinks.values;
    }

    async loadView(viewPath) {
        return await dh.dv.view(this.subpathRelativeToVault(viewPath));
    }

    initRenderer(renderModule) {
        // notice only once per session
        if (!window._iterateCV_rendererNoticed) {
            window._iterateCV_rendererNoticed = true;
            new Notice('IterateCV: Calling ScriptManager.initRenderer() is deprecated. Please migrate to the new template format.');
        }
        const { LegacyRenderer } = require('./legacy/render');
        const template = this.getTemplate(renderModule);
        return new LegacyRenderer(template);
    }

    getTemplate(templateModule) {
        if (templateModule && typeof templateModule === 'object') {
            if (typeof templateModule.Template !== 'function') {
                throw new Error('Template module does not export a Template class.');
            }
            return new templateModule.Template();
        }

        const [modulePath, className] = String(templateModule).split('::');
        const mod = require(path.join(this.scriptsDirFull, modulePath));
        const TemplateClass = className ? mod[className] : mod.Template;

        if (typeof TemplateClass !== 'function') {
            throw new Error(`Class ${className || 'Template'} not found in module ${modulePath}.`);
        }

        return new TemplateClass();
    }

    get frontmatter() {
        return dh.dv.current().file.frontmatter;
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
