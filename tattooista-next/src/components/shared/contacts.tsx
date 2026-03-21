export function Contacts() {
  const mapUrl =
    "https://www.google.com/maps/place/Bj+Nicolaisensvei+18,+3290+Stavern,+Norway/@59.0091885,10.0354468,17z/data=!3m1!4b1!4m6!3m5!1s0x4646e95c873067c5:0xd41a56ea63c87b62!8m2!3d59.0091885!4d10.0354468!16s%2Fg%2F11c4jk7s4_?entry=ttu"

  return (
    <section className="pt-[70px] md:pt-[112px]" id="contacts">
      <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-[40px] md:mb-[132px]">
        Contacts
      </h2>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="container relative flex items-start w-full h-[370px] md:h-[517px] bg-[url('/images/mapInkDrop.png')] bg-cover bg-[position:right_-60px_top_0] sm:bg-[position:right_0_bottom_0] bg-no-repeat grayscale overflow-visible"
      >
        <div className="flex flex-col gap-6 p-[36px_18px] md:p-[60px_44px] w-full max-w-[300px] md:max-w-[480px] text-[#080808] text-[18px] md:text-[30px] font-medium md:font-bold bg-[#fafafa] -translate-y-[90px] shadow-[0_3px_8px_rgba(0,0,0,0.4)]">
          <h4 className="m-0 text-[23px] md:text-[30px] font-bold uppercase">
            Adelaine Hobf <br />Studio
          </h4>
          <p className="m-0 font-medium">
            Bj Nicolaisensvei 18,<br />
            3290, Stavern
          </p>
          <p className="m-0 font-semibold">
            +47 455 19 015<br />
            ah_tattoo@gmail.com
          </p>
        </div>
      </a>
    </section>
  )
}
