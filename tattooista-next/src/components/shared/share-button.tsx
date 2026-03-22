"use client"

type Props = {
  socialLink: string
  icon: React.ReactNode
  isInstagram?: boolean
  tooltipText: string
}

export function ShareButton({
  icon,
  socialLink,
  isInstagram,
  tooltipText,
}: Props) {
  const handleClick = () => {
    if (isInstagram) {
      navigator.clipboard.writeText(window.location.href)
      window.open(socialLink, "_blank")
    } else {
      const encodedUrl = encodeURIComponent(window.location.href)
      window.open(`${socialLink}=${encodedUrl}`, "_blank")
    }
  }

  return (
    <li>
      <button
        className="flex justify-center items-center w-[45px] h-[45px] bg-transparent border-none cursor-pointer"
        title={tooltipText}
        onClick={handleClick}
      >
        {icon}
      </button>
    </li>
  )
}
