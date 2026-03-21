"use client"

import { useEffect, useState } from "react"

type Props = {
  question: string
  answer: string
}

export function FaqItem({ question, answer }: Props) {
  const [isShown, setIsShown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const showText = () => {
    if (!isMobile) setIsShown(true)
  }

  const hideText = () => {
    if (!isMobile) setIsShown(false)
  }

  const toggleText = () => {
    if (isMobile) setIsShown((prev) => !prev)
  }

  return (
    <li style={{ position: "relative", paddingTop: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.65)" }}>
      <div className="relative flex items-center gap-4">
        <h5 className="m-0 w-[80%] text-[18px] md:text-[24px] font-semibold">
          {question}
        </h5>
        <button
          className="relative ml-auto p-4 border-none bg-transparent cursor-pointer flex items-center justify-center"
          onMouseOver={showText}
          onMouseOut={hideText}
          onClick={toggleText}
        >
          <span
            className="block w-[16px] h-[16px] border-2 border-foreground border-l-0 border-t-0 rounded-[2px] transition-all duration-300"
            style={{
              transform: isShown
                ? "rotate(225deg) skew(-4deg, -4deg)"
                : "rotate(45deg) skew(-4deg, -4deg)",
            }}
          />
        </button>
      </div>
      <p
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: "translate(0, 100%)",
          margin: 0,
          marginTop: isShown ? "16px" : "0",
          padding: isShown ? "1.5rem 1rem 1.5rem 112px" : "0 1rem 0 112px",
          height: isShown ? "auto" : "0",
          overflow: "hidden",
          backgroundColor: "#080808",
          backgroundImage: "url('/images/body-bg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          zIndex: 20,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {answer}
      </p>
    </li>
  )
}
