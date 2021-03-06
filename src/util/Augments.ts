declare global {

  interface Array<T> {
    first(): T | undefined,

    last(): T | undefined

    delete(item: T): number

    deleteAll(items: Array<T>): number

    remove(item: T): Array<T>

    isEmpty(): boolean

    includesAll(array: Array<T>): boolean

    hasMore(): boolean
  }

  interface String {
    isBlank(): boolean
  }

}

Array.prototype.first = function <T>(): T | undefined {
  return this.length > 0 ? this[0] : undefined
}

Array.prototype.last = function <T>(): T | undefined {
  return this.length > 0 ? this[this.length - 1] : undefined
}

Array.prototype.delete = function <T>(item: T): number {
  const index = this.indexOf(item)
  this.splice(index, 1)
  return index
}

Array.prototype.deleteAll = function <T>(items: Array<T>): number {
  for (const item of items) {
    this.splice(this.indexOf(item), 1)
  }

  return this.length
}

Array.prototype.remove = function <T>(item: T): Array<T> {
  this.delete(item)
  return this
}

Array.prototype.isEmpty = function (): boolean {
  return this.length == 0
}

Array.prototype.includesAll = function <T>(array: Array<T>): boolean {
  array.forEach(it => {
    if (!this.includes(it)) {
      return false
    }
  })

  return true
}

Array.prototype.hasMore = function (): boolean {
  return this.length > 1
}

String.prototype.isBlank = function (): boolean {
  return this.length == 0 || this.trim().length == 0
}

export {}