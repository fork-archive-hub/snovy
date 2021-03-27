import Dexie from "dexie"
import Notebook from "./model/Notebook"
import State from "./model/State"
import Scope from "./model/Scope"
import Tag from "./model/Tag"
import Note from "./model/Note"
import Section from "./model/Section"
import Options from "./model/options/Options"
import {Theme} from "./model/options/Theme"
import {dexie} from "../index"
import {defaults} from "./model/options/Defaults"

export const notebookId = "notebookId"
export const sectionId = "sectionId"
export const noteId = "noteId"
export const scopeId = "scopeId"
export const tagId = "tagId"
export const stateId = "stateId"
export const themeId = "themeId"

export const title = "title"
export const order = "order"
export const color = "color"

const createdAt = "createdAt"
const updatedAt = "updatedAt"

class Database extends Dexie {

  options: Dexie.Table<Options, number>
  themes: Dexie.Table<Theme, number>
  notebooks: Dexie.Table<Notebook, number>
  sections: Dexie.Table<Section, number>
  notes: Dexie.Table<Note, number>
  tags: Dexie.Table<Tag, number>
  scopes: Dexie.Table<Scope, number>
  states: Dexie.Table<State, number>

  constructor() {
    super("snovyDB")

    this.version(1).stores({
      options: Database.buildColumns(["singleNotebook", themeId]),
      themes: Database.buildColumns([title,
        "primary", "secondary", "textPrimary", "textSecondary",
        "accent", "border", "hover", "activeItem"]),
      notebooks: Database.buildColumns([notebookId, title]),
      sections: Database.buildColumns([notebookId, title, order]),
      notes: Database.buildColumns([sectionId, stateId, "*tagIds", title, "content", order]),
      tags: Database.buildColumns([notebookId, scopeId, title, color]),
      scopes: Database.buildColumns([notebookId, "*tagIds", "&" + title, color]),
      states: Database.buildColumns([notebookId, "*noteIds", "&" + title, color])
    })

    this.options = this.table("options")
    this.themes = this.table("themes")
    this.notebooks = this.table("notebooks")
    this.sections = this.table("sections")
    this.notes = this.table("notes")
    this.tags = this.table("tags")
    this.scopes = this.table("scopes")
    this.states = this.table("states")

    this.options.mapToClass(Options)
    this.themes.mapToClass(Theme)
    this.notebooks.mapToClass(Notebook)
    this.sections.mapToClass(Section)
    this.notes.mapToClass(Note)
    this.scopes.mapToClass(Scope)
    this.tags.mapToClass(Tag)
    this.states.mapToClass(State)
  }

  static buildColumns(names: Array<string>) {
    return "++id,".concat(names.join(",")).concat(createdAt + ",", updatedAt)
  }

}

export const fetchThemes = async () => {
  return dexie.themes.toArray().then(async (loadedThemes) => {
    if (loadedThemes.isEmpty()) {
      for (const theme of defaults.themes) {
        await theme.create()
      }

      return await dexie.themes.toArray()
    } else {
      return loadedThemes
    }
  })
}

export default Database