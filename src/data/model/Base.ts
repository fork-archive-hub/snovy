import {WithTitle} from "../../component/list/List"
import {isArray, isItem} from "../../util/Utils"

export abstract class Table {

  id!: number
  readonly createdAt: Date
  updatedAt: Date

  protected constructor(id?: number) {
    if (id) this.id = id
    this.createdAt = new Date()
    this.updatedAt = this.createdAt
  }

  static compareById = (a: Table, b: Table) => { return a.id - b.id}

  abstract save(): Promise<any>

  abstract load(): Promise<any>

  abstract create(): Promise<any>

  abstract delete(): Promise<any>

}

export abstract class Titled extends Table implements WithTitle {

  title: string

  protected constructor(title: string, id?: number) {
    super(id)
    this.title = title
  }

  static compareByName = (a: Titled, b: Titled) => { return a.title.localeCompare(b.title, undefined, {numeric: true})}

  toString(): string {
    return this.title
  }

  updateTitle(newTitle: string) {
    this.title = newTitle
    this.save()
  }

}

export abstract class Ordered extends Titled {

  order: number

  protected constructor(title: string, order: number, id?: number) {
    super(title, id)
    this.order = order
  }

  static compareByOrder = (a: Ordered, b: Ordered) => {return a.order - b.order}

  updateOrder(newOrder: number) {
    this.order = newOrder
    this.save()
  }

}

export abstract class Colored extends Titled {

  color: string

  protected constructor(title: string, color: string, id?: number) {
    super(title, id)
    this.color = color
  }

  updateColor(newColor: string) {
    this.color = newColor
    this.save()
  }

}

export interface WithOrderedChildren<T extends Ordered> {

  add: (order?: number) => T

  remove: (item?: T | Array<T>) => T | undefined

}

export function addTo<T extends Ordered>(items: Array<T>, toAdd: T, order?: number) {
  if (order) {
    items.sort(Ordered.compareByOrder).slice(toAdd.order).forEach(value => {
      value.updateOrder(value.order + 1)
    })
  }

  items.push(toAdd)
  toAdd.create()

  return toAdd
}

export function removeFrom<T extends Ordered>(items: Array<T>, toRemove?: T | Array<T>) {
  if (isArray(toRemove)) {
    let index

    for (const item of toRemove) {
      index = removeAndReorder(items, item)
    }

    return fetchItem(items, index)
  } else if (isItem(toRemove)) {
    return fetchItem(items, removeAndReorder(items, toRemove))
  } else {
    return undefined
  }
}

function removeAndReorder<T extends Ordered>(items: Array<T>, toRemove: T) {
  const index = items.delete(toRemove)
  toRemove.delete()
  items.slice(index).forEach(value => value.order--)

  return index
}

function fetchItem<T>(items: Array<T>, index: number) {
  if (index > 0) {
    return items[index - 1]
  } else if (index == 0 && items.length > 1) {
    return items[index]
  } else {
    return undefined
  }
}