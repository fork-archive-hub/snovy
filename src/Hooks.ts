import React, {Dispatch, SetStateAction, useEffect, useState} from "react"

export function useHideOnOutsideClick(elementRef: React.RefObject<Element | undefined>):
  [boolean, Dispatch<SetStateAction<boolean>>] {

  const [hidden, setHidden] = useState(false)

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick)

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
      }
    }, []
  )

  const handleOutsideClick = (e: any) => {
    if (!elementRef.current?.contains(e.target)) {
      setHidden(false)
    }
  }

  return [hidden, setHidden]
}

export function useCollapse(elementRef: React.RefObject<HTMLElement | undefined>):
  [boolean, Dispatch<SetStateAction<boolean>>] {

  const [collapsed, setCollapsed] = useState(false)

  useEffect(
    () => {
      // elementRef.current!.style.transition = "opacity 600"
      elementRef.current!.classList.remove("snovy-hooks-collapsible")
    }, []
  )

  if (elementRef.current) {
    if (collapsed) {
      elementRef.current.classList.remove("snovy-hooks-rolling")
      elementRef.current.classList.add("snovy-hooks-unrolling")

      // elementRef.current.style.opacity = "0"
      // setTimeout(() => elementRef.current!.style.height = "0", 600)
    } else {
      elementRef.current.classList.remove("snovy-hooks-rolling")
      elementRef.current.classList.add("snovy-hooks-unrolling")

      // elementRef.current.style.height = "100%"
      // elementRef.current.style.opacity = "1"
    }
  }

  return [collapsed, setCollapsed]
}