"use client"

import { useState } from "react"

type Props = {
  id?: string
  text: string
  amountOfWords?: number
}

export function ReadMore({ id, text, amountOfWords = 36 }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const words = text.split(" ")
  const needsTruncation = words.length > amountOfWords
  const beginText = needsTruncation
    ? words.slice(0, amountOfWords - 1).join(" ")
    : text
  const endText = words.slice(amountOfWords - 1).join(" ")

  return (
    <p id={id}>
      {beginText}
      {needsTruncation && (
        <>
          {!isExpanded && <span>... </span>}
          <span
            className={!isExpanded ? "hidden" : ""}
            aria-hidden={!isExpanded}
          >
            {endText}
          </span>
          <span
            className={`inline-block font-bold cursor-pointer ${isExpanded ? "block ml-auto translate-x-8" : ""}`}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls={id}
            onClick={() => setIsExpanded(!isExpanded)}
            onKeyDown={(e) => {
              if (e.code === "Space" || e.code === "Enter") setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? "show less" : "read more"}
          </span>
        </>
      )}
    </p>
  )
}
