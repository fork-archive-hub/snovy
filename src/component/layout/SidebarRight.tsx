import React from "react"
import {Orientation} from "../tab_menu/TabMenu"
import Notebook from "../../model/Notebook"
import Tag from "../../model/coloured/Tag"
import {ManagedSidebar} from "./Sidebar"
import NoteDetail from "../NoteDetail"
import TagManager from "../tag/TagManager"

const SidebarRight = (props: {
  activeNotebook: Notebook | undefined,
  activeTag: Tag | undefined,
  onActiveTagChange: (tag: Tag | undefined) => any
}) => {

  return (
    <ManagedSidebar orientation={Orientation.RIGHT} tabs={mappings}>
      {[
        {
          text: mappings[0].text, children: <NoteDetail/>
        },
        {
          text: mappings[1].text,
          children: <TagManager activeNotebook={props.activeNotebook} activeTag={props.activeTag}
                                onActiveChange={props.onActiveTagChange}
          />
        }
      ]}
    </ManagedSidebar>
  )

}

const mappings = [
  {text: "Note Detail", default: true},
  {text: "Tag Manager"},
  {text: "Filtering Options"}
]

export default SidebarRight