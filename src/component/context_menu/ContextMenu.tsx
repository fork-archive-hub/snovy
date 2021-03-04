import React, {useRef} from "react"
import ContextMenuItem from "./ContextMenuItem"
import {useContextMenu} from "../../util/Hooks"

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  children: Array<React.ReactElement<typeof ContextMenuItem>>,
  onFinish: () => void
}) => {

  if (props.children.isEmpty()) {
    return null
  }

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, setVisible, position} = useContextMenu(selfRef, props.parentRef)

  return (
    <>
      {visible &&
      <div
        className="snovy-context-menu" ref={selfRef} onClick={() => {
        props.onFinish()
        setVisible(false)
      }} style={position}
      >
        {props.children}
      </div>
      }
    </>
  )

}

export default ContextMenu