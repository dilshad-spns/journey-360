export default function Numbers() {
  return (
    <div className="relative size-full" data-name="Numbers">
      <div className="absolute left-0 size-[58px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58 58">
          <circle cx="29" cy="29" fill="var(--fill-0, #CEEAF6)" id="Ellipse 3" r="29" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-1/2 not-italic text-[#2688e4] text-[14px] text-center text-nowrap top-1/2 translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[14px] whitespace-pre">1 2 3</p>
      </div>
    </div>
  );
}