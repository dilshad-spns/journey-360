import svgPaths from "./svg-pg5wjz8x6o";

export default function Progress() {
  return (
    <div className="relative size-full" data-name="Progress">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58 58">
        <g clipPath="url(#clip0_220_212)" id="Progress">
          <circle cx="29" cy="29" fill="var(--fill-0, #CEEAF6)" id="Ellipse 3" r="29" />
          <g id="arrow_upload_progress">
            <mask height="24" id="mask0_220_212" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="17" y="17">
              <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" x="17" y="17" />
            </mask>
            <g mask="url(#mask0_220_212)">
              <path d={svgPaths.p35255000} fill="var(--fill-0, #2688E4)" id="arrow_upload_progress_2" />
            </g>
          </g>
        </g>
        <defs>
          <clipPath id="clip0_220_212">
            <rect fill="white" height="58" width="58" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}