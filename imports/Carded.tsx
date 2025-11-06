function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-start left-1/2 top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]">
      <div className="h-[17px] relative rounded-[4px] shrink-0 w-[20px]">
        <div aria-hidden="true" className="absolute border border-[#2688e4] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
      <div className="h-[17px] relative rounded-[4px] shrink-0 w-[20px]">
        <div aria-hidden="true" className="absolute border border-[#2688e4] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

export default function Carded() {
  return (
    <div className="relative size-full" data-name="Carded">
      <div className="absolute left-0 size-[58px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58 58">
          <circle cx="29" cy="29" fill="var(--fill-0, #CEEAF6)" id="Ellipse 3" r="29" />
        </svg>
      </div>
      <Frame />
    </div>
  );
}