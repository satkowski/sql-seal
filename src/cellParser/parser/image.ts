import { CellFunction } from "../CellFunction";
import { CellParserResult } from "../ModernCellParser";
import { App } from "obsidian";
import { isLinkLocal } from "src/utils/ui/helperFunctions";

type Args = [string] | [string, string]

export class ImageParser implements CellFunction<Args> {

    constructor(private readonly app: App, private readonly create = createEl) { }

    get name(): string {
        return 'img'
    }

    get sqlFunctionArgumentsCount() {
        return 2 // FIXME: should it be 1 or 2?
    }

    prepare([href, path]: Args): CellParserResult {
        if (!isLinkLocal(href)) {
            return createEl('img', { attr: { src: href } });
        }
        href = (href ?? '').trim()
        if (href.startsWith('![[')) {
            href = href.slice(3, -2)
        }
        let parentPath = ''
        if (path) {
            const parent = this.app.vault.getFileByPath(path)
            if (parent) {
                parentPath = parent.parent?.path ?? ''
            }
        }
        path = (path ? parentPath + '/' : '') + href
        const file = this.app.vault.getFileByPath(path);
        if (!file) {
            return 'File does not exist'
        }
        return this.create('img', { attr: { src: this.app.vault.getResourcePath(file) } });
    }
}