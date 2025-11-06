function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-start left-[14px] top-[19px] w-[30px]">
      <div className="basis-0 grow h-[21px] min-h-px min-w-px relative rounded-[4px] shrink-0">
        <div aria-hidden="true" className="absolute border border-[#2688e4] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
      <div className="basis-0 grow h-[21px] min-h-px min-w-px relative rounded-[4px] shrink-0">
        <div aria-hidden="true" className="absolute border border-[#2688e4] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

export default function Simple() {
  return (
    <div className="relative size-full" data-name="Simple">
      <div className="absolute left-0 size-[58px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58 58">
          <circle cx="29" cy="29" fill="var(--fill-0, #CEEAF6)" id="Ellipse 3" r="29" />
        </svg>
      </div>
      <Frame />
    </div>
  );
}