function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] items-start left-[calc(50%+0.5px)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[25px]">
      <div className="bg-[#2688e4] h-[3px] relative rounded-[2px] shrink-0 w-[11px]">
        <div aria-hidden="true" className="absolute border border-[#2688e4] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <div className="h-[2px] relative rounded-[1.5px] shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[#2688e4] border-solid inset-0 pointer-events-none rounded-[1.5px]" />
      </div>
      <div className="h-[2px] relative rounded-[1.5px] shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[#2688e4] border-solid inset-0 pointer-events-none rounded-[1.5px]" />
      </div>
    </div>
  );
}

export default function Top() {
  return (
    <div className="relative size-full" data-name="Top">
      <div className="absolute left-0 size-[58px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58 58">
          <circle cx="29" cy="29" fill="var(--fill-0, #CEEAF6)" id="Ellipse 3" r="29" />
        </svg>
      </div>
      <Frame />
    </div>
  );
}