"use client"

import { ShareButton } from "./share-button"

function SocialIcon({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-full"
      style={{ filter: "brightness(0) invert(1)" }}
    />
  )
}

export function Advertisement() {
  return (
    <section className="flex flex-col gap-y-5 mt-[100px] md:mt-0 md:mt-[69px]">
      <div className="flex flex-col items-start gap-y-4 md:flex-row md:items-center md:justify-center md:gap-8 md:mb-[60px]">
        <h3 className="mt-0 mb-0 text-left text-[25px] md:text-[43px] font-semibold">
          Share this page:
        </h3>
        <ul className="flex items-center gap-x-4 list-none m-0 p-0">
          <ShareButton
            tooltipText="Copy link and Share on Instagram"
            socialLink="https://www.instagram.com/"
            icon={<SocialIcon src="/icons/instagram.svg" alt="Instagram" />}
            isInstagram
          />
          <ShareButton
            tooltipText="Share on Facebook"
            socialLink="https://www.facebook.com/sharer/sharer.php?u"
            icon={<SocialIcon src="/icons/facebook.svg" alt="Facebook" />}
          />
          <ShareButton
            tooltipText="Share on LinkedIn"
            socialLink="https://www.linkedin.com/sharing/share-offsite/?url"
            icon={<SocialIcon src="/icons/linkedin.svg" alt="LinkedIn" />}
          />
          <ShareButton
            tooltipText="Share on Twitter"
            socialLink="https://twitter.com/intent/tweet?url"
            icon={<SocialIcon src="/icons/twitter.svg" alt="Twitter" />}
          />
        </ul>
      </div>
    </section>
  )
}
