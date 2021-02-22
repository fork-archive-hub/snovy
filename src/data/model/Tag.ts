import Scope from "./Scope"
import {dexie} from "../../index"
import {Colored} from "./Base"

export default class Tag extends Colored {

  notebookId: number
  scopeId?: number

  scope?: Scope

  constructor(notebookId: number, title: string, color: string, scopeId?: number, id?: number) {
    super(title, color, id)
    this.notebookId = notebookId
    this.scopeId = scopeId
  }

  static async bulkLoad(tags: Array<Tag>) {
    for (const tag of tags) {
      await tag.load()
    }

    return tags
  }

  async create() {
    return dexie.transaction("rw", dexie.tags, () => {dexie.tags.add(this)}).then(_it => this)
  }

  //TODO untag notes, remove from scope
  delete() {
    return dexie.transaction("rw", dexie.tags, () => {dexie.tags.delete(this.id)})
  }

  async load() {
    return Promise.all([
      this.scopeId ? await dexie.scopes.get(this.scopeId).then(async scope => this.scope = await scope?.load()) : () => false
    ]).then(_it => this)
  }

  save() {
    return Promise.resolve(undefined)
  }

  //TODO query
  unTagNoteAll() {
    return this
  }

  addScope(scope: Scope) {
    scope.scopeTag(this)
  }

  removeScope(scope: Scope) {
    scope.unScopeTag(this)
  }

  isEqual(tag: Tag): boolean {
    return this.scope == tag.scope && this.title == tag.title
  }

  toString(): string {
    return this.scope ? this.scope.toString() + this.title : super.toString()
  }

  static compareByScope =
    (a: Tag, b: Tag) => { return Number(a.scope) - Number(b.scope)}

  static compareByExclusivity =
    (a: Tag, b: Tag) => { return Number(a.scope?.unique) - Number(b.scope?.unique)}

}