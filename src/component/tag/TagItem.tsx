import React, {useState} from "react"
import Tag from "../../model/colored/Tag"
import {CollapseButton, RemoveButton} from "../inputs/Button"
import Scope from "../../model/colored/Scope"
import {default as TinyColor} from "tinycolor2"

export const TagItem = (props: {
  mapped: Tag,
  onRemove: (tag: Tag) => void,
}) => {
  return (
    <span className="snovy-tag-item" style={style(props.mapped.color)}>
      <span className="tag-name" style={style(props.mapped.color, -10)}>{props.mapped.name}</span>
      <RemoveButton onClick={() => props.onRemove(props.mapped)}/>
    </span>
  )
}

export const TagItemScoped = (props: TagItemProps) => {
  return (
    <>
      {props.scope.exclusive ?
        <ExclusiveScopedTagItem
          scope={props.scope} mapped={props.mapped} onRemove={props.onRemove}
          onRemoveScope={props.onRemoveScope}
        /> :
        <ScopedTagItem
          scope={props.scope} mapped={props.mapped} onRemove={props.onRemove}
          onRemoveScope={props.onRemoveScope}
        />
      }
    </>
  )
}

export const ScopedTagItem = (props: TagItemProps) => {

  const [collapsed, setCollapsed] = useState(false)

  return (
    <span className="snovy-tag-item tag-grouped" style={style(props.scope.color)}>
      <div className="tag-group-header">
        <CollapseButton onClick={() => {setCollapsed(!collapsed)}} toggle={collapsed}/>
        <span className="tag-scope">{props.scope.name}</span>
        <RemoveButton onClick={() => props.onRemoveScope(props.mapped)}/>
      </div>
      {!collapsed && <div className="tag-container" style={style(props.scope.color, 40)}>
        {props.mapped.map((tag) => <TagItem key={tag.toString()} mapped={tag} onRemove={props.onRemove}/>)}
      </div>}
    </span>
  )
}

export const ExclusiveScopedTagItem = (props: TagItemProps) => {
  return (
    <span className="snovy-tag-item tag-exclusive" style={style(props.scope.color)}>
      <span className="tag-scope" style={style(props.scope.color, 30)}>{props.scope.name}</span>
      <span className="tag-name" style={style(props.scope.color, 10)}>{props.mapped[0].name}</span>
      <RemoveButton onClick={() => props.onRemoveScope(props.mapped)}/>
    </span>
  )
}

type TagItemProps = {
  scope: Scope,
  mapped: Array<Tag>,
  onRemove: (tag: Tag) => void,
  onRemoveScope: (tags: Array<Tag>) => void
}

function style(color: string, amount = 0) {
  const tiny = new TinyColor(color)
  const style: React.CSSProperties = {}

  if (tiny.isDark()) {
    style["backgroundColor"] = tiny.lighten(amount).toHex8String()
  } else {
    style["backgroundColor"] = tiny.darken(amount).toHex8String()
  }

  if (tiny.isDark()) {
    style["color"] = "#ffffff"
  } else {
    style["color"] = "#000000"
  }

  return style
}
