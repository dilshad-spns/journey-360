// SVG imports for BasicInformation component
import svgPaths from "./svg-h4mzohokkv";
import { img } from "./svg-lw6uy";

function Group() {
  return (
    <div
      className='absolute inset-[24.18%_21.68%_24.18%_21.93%]'
      data-name='Group'
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 49 40'
      >
        <g id='Group'>
          <path
            d={svgPaths.p344c6780}
            fill='var(--fill-0, #191919)'
            id='Vector'
          />
          <path
            d={svgPaths.p2b8fdff2}
            fill='var(--fill-0, #191919)'
            id='Vector_2'
          />
          <path
            d={svgPaths.p1b2b01f0}
            fill='var(--fill-0, #191919)'
            id='Vector_3'
          />
        </g>
      </svg>
    </div>
  );
}

function Connector() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[8px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0'
      data-name='Connector'
    >
      <div
        className='content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full'
        data-name='Connector'
      >
        <div className='h-[4px] relative shrink-0 w-full' data-name='Divider'>
          <div
            className='absolute bottom-0 left-0 right-0 top-full'
            data-name='Divider'
          >
            <div
              className='absolute bottom-0 left-0 right-0 top-[-4px]'
              style={
                {
                  "--stroke-0": "rgba(255, 255, 255, 1)",
                } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 104 4'
              >
                <line
                  id='Divider'
                  stroke='var(--stroke-0, white)'
                  strokeLinecap='square'
                  strokeOpacity='0.01'
                  strokeWidth='4'
                  x1='2'
                  x2='101.75'
                  y1='2'
                  y2='2'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectorLast() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[8px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0'
      data-name='Connector_last'
    >
      <div
        className='content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full'
        data-name='Connector'
      >
        <div className='h-[4px] relative shrink-0 w-full' data-name='Divider'>
          <div
            className='absolute bottom-0 left-0 right-0 top-full'
            data-name='Divider'
          >
            <div
              className='absolute bottom-0 left-0 right-0 top-[-4px]'
              style={
                { "--stroke-0": "rgba(0, 28, 86, 1)" } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 104 4'
              >
                <line
                  id='Divider'
                  stroke='var(--stroke-0, #001C56)'
                  strokeLinecap='square'
                  strokeWidth='4'
                  x1='2'
                  x2='101.75'
                  y1='2'
                  y2='2'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockUp() {
  return (
    <div
      className='content-stretch flex gap-[4px] items-center relative shrink-0 w-full'
      data-name='Lock up'
    >
      <div className='basis-0 flex flex-row grow items-center self-stretch shrink-0'>
        <Connector />
      </div>
      <div
        className='bg-[#001c56] content-stretch flex gap-[8px] items-center justify-center relative rounded-[99px] shrink-0 size-[32px]'
        data-name='1_Bubble'
      >
        <div
          className='overflow-clip relative shrink-0 size-[20px]'
          data-name='check'
        >
          <div
            className='absolute inset-[25.03%_14.24%_22.57%_15.95%]'
            data-name='Vector'
          >
            <div
              className='absolute inset-0'
              style={
                { "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 14 11'
              >
                <path
                  d={svgPaths.p25099580}
                  fill='var(--fill-0, white)'
                  id='Vector'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className='basis-0 flex flex-row grow items-center self-stretch shrink-0'>
        <ConnectorLast />
      </div>
    </div>
  );
}

function TextSubPage() {
  return (
    <div
      className='content-stretch flex flex-col items-center relative shrink-0 w-full'
      data-name='Text+sub page'
    >
      <div
        className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#030b17] text-[14px] text-center text-nowrap w-full"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='[white-space-collapse:collapse] leading-[20px] overflow-ellipsis overflow-hidden'>
          Basic Information
        </p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[4px] grow items-center min-h-px min-w-px relative shrink-0'
      data-name='Content'
    >
      <LockUp />
      <TextSubPage />
    </div>
  );
}

function Connector1() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[8px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0'
      data-name='Connector'
    >
      <div
        className='content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full'
        data-name='Connector'
      >
        <div className='h-[4px] relative shrink-0 w-full' data-name='Divider'>
          <div
            className='absolute bottom-0 left-0 right-0 top-full'
            data-name='Divider'
          >
            <div
              className='absolute bottom-0 left-0 right-0 top-[-4px]'
              style={
                { "--stroke-0": "rgba(0, 28, 86, 1)" } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 104 4'
              >
                <line
                  id='Divider'
                  stroke='var(--stroke-0, #001C56)'
                  strokeLinecap='square'
                  strokeWidth='4'
                  x1='2'
                  x2='101.75'
                  y1='2'
                  y2='2'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepperText() {
  return (
    <div
      className='h-[17.6px] relative shrink-0 w-[24px]'
      data-name='stepper text'
    >
      <div
        className="absolute flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[14px] text-center text-white"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='leading-[20px]'>2</p>
      </div>
    </div>
  );
}

function ConnectorLast1() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[8px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0'
      data-name='Connector_last'
    >
      <div
        className='content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full'
        data-name='Connector'
      >
        <div className='h-[4px] relative shrink-0 w-full' data-name='Divider'>
          <div
            className='absolute bottom-0 left-0 right-0 top-full'
            data-name='Divider'
          >
            <div
              className='absolute bottom-0 left-0 right-0 top-[-4px]'
              style={
                { "--stroke-0": "rgba(0, 28, 86, 1)" } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 104 4'
              >
                <line
                  id='Divider'
                  stroke='var(--stroke-0, #001C56)'
                  strokeLinecap='square'
                  strokeWidth='4'
                  x1='2'
                  x2='101.75'
                  y1='2'
                  y2='2'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockUp1() {
  return (
    <div
      className='content-stretch flex gap-[4px] items-center relative shrink-0 w-full'
      data-name='Lock up'
    >
      <div className='basis-0 flex flex-row grow items-center self-stretch shrink-0'>
        <Connector1 />
      </div>
      <div
        className='bg-[#001c56] content-stretch flex gap-[8px] items-center justify-center relative rounded-[99px] shrink-0 size-[32px]'
        data-name='1_Bubble'
      >
        <div className='absolute inset-[-2px] rounded-[56px]' data-name='Focus'>
          <div
            aria-hidden='true'
            className='absolute border-2 border-[#01133a] border-solid inset-[-2px] pointer-events-none rounded-[58px]'
          />
        </div>
        <StepperText />
      </div>
      <div className='basis-0 flex flex-row grow items-center self-stretch shrink-0'>
        <ConnectorLast1 />
      </div>
    </div>
  );
}

function TextSubPage1() {
  return (
    <div
      className='content-stretch flex flex-col items-center relative shrink-0 w-full'
      data-name='Text+sub page'
    >
      <div
        className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#030b17] text-[14px] text-center text-nowrap w-full"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='[white-space-collapse:collapse] leading-[20px] overflow-ellipsis overflow-hidden'>
          Benefit selection
        </p>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[4px] grow items-center min-h-px min-w-px relative shrink-0'
      data-name='Content'
    >
      <LockUp1 />
      <TextSubPage1 />
    </div>
  );
}

function Connector2() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[8px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0'
      data-name='Connector'
    >
      <div
        className='content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full'
        data-name='Connector'
      >
        <div className='h-[4px] relative shrink-0 w-full' data-name='Divider'>
          <div
            className='absolute bottom-0 left-0 right-0 top-full'
            data-name='Divider'
          >
            <div
              className='absolute bottom-0 left-0 right-0 top-[-4px]'
              style={
                { "--stroke-0": "rgba(0, 28, 86, 1)" } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 104 4'
              >
                <line
                  id='Divider'
                  stroke='var(--stroke-0, #001C56)'
                  strokeLinecap='square'
                  strokeWidth='4'
                  x1='2'
                  x2='101.75'
                  y1='2'
                  y2='2'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepperText1() {
  return (
    <div
      className='h-[17.6px] relative shrink-0 w-[24px]'
      data-name='stepper text'
    >
      <div
        className="absolute flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#717782] text-[14px] text-center"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='leading-[20px]'>3</p>
      </div>
    </div>
  );
}

function ConnectorLast2() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[8px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0'
      data-name='Connector_last'
    >
      <div
        className='content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full'
        data-name='Connector'
      >
        <div className='h-[4px] relative shrink-0 w-full' data-name='Divider'>
          <div
            className='absolute bottom-0 left-0 right-0 top-full'
            data-name='Divider'
          >
            <div
              className='absolute bottom-0 left-0 right-0 top-[-4px]'
              style={
                { "--stroke-0": "rgba(0, 28, 86, 1)" } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 104 4'
              >
                <line
                  id='Divider'
                  stroke='var(--stroke-0, #001C56)'
                  strokeLinecap='square'
                  strokeWidth='4'
                  x1='2'
                  x2='101.75'
                  y1='2'
                  y2='2'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockUp2() {
  return (
    <div
      className='content-stretch flex gap-[4px] items-center relative shrink-0 w-full'
      data-name='Lock up'
    >
      <div className='basis-0 flex flex-row grow items-center self-stretch shrink-0'>
        <Connector2 />
      </div>
      <div
        className='bg-white content-stretch flex gap-[8px] items-center justify-center relative rounded-[99px] shrink-0 size-[32px]'
        data-name='1_Bubble'
      >
        <div
          aria-hidden='true'
          className='absolute border border-[#717782] border-solid inset-0 pointer-events-none rounded-[99px]'
        />
        <StepperText1 />
      </div>
      <div className='basis-0 flex flex-row grow items-center self-stretch shrink-0'>
        <ConnectorLast2 />
      </div>
    </div>
  );
}

function TextSubPage2() {
  return (
    <div
      className='content-stretch flex flex-col items-center relative shrink-0 w-full'
      data-name='Text+sub page'
    >
      <div
        className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#030b17] text-[14px] text-center text-nowrap w-full"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='[white-space-collapse:collapse] leading-[20px] overflow-ellipsis overflow-hidden'>
          Personal details
        </p>
      </div>
    </div>
  );
}

function Content2() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[4px] grow items-center min-h-px min-w-px relative shrink-0'
      data-name='Content'
    >
      <LockUp2 />
      <TextSubPage2 />
    </div>
  );
}

function Connector3() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[8px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0'
      data-name='Connector'
    >
      <div
        className='content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full'
        data-name='Connector'
      >
        <div className='h-[4px] relative shrink-0 w-full' data-name='Divider'>
          <div
            className='absolute bottom-0 left-0 right-0 top-full'
            data-name='Divider'
          >
            <div
              className='absolute bottom-0 left-0 right-0 top-[-4px]'
              style={
                { "--stroke-0": "rgba(0, 28, 86, 1)" } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 104 4'
              >
                <line
                  id='Divider'
                  stroke='var(--stroke-0, #001C56)'
                  strokeLinecap='square'
                  strokeWidth='4'
                  x1='2'
                  x2='101.75'
                  y1='2'
                  y2='2'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepperText2() {
  return (
    <div
      className='h-[17.6px] relative shrink-0 w-[24px]'
      data-name='stepper text'
    >
      <div
        className="absolute flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#717782] text-[14px] text-center"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='leading-[20px]'>4</p>
      </div>
    </div>
  );
}

function ConnectorLast3() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[8px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0'
      data-name='Connector_last'
    >
      <div
        className='content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full'
        data-name='Connector'
      >
        <div className='h-[4px] relative shrink-0 w-full' data-name='Divider'>
          <div
            className='absolute bottom-0 left-0 right-0 top-full'
            data-name='Divider'
          >
            <div
              className='absolute bottom-0 left-0 right-0 top-[-4px]'
              style={
                {
                  "--stroke-0": "rgba(255, 255, 255, 1)",
                } as React.CSSProperties
              }
            >
              <svg
                className='block size-full'
                fill='none'
                preserveAspectRatio='none'
                viewBox='0 0 104 4'
              >
                <line
                  id='Divider'
                  stroke='var(--stroke-0, white)'
                  strokeLinecap='square'
                  strokeOpacity='0.01'
                  strokeWidth='4'
                  x1='2'
                  x2='101.75'
                  y1='2'
                  y2='2'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockUp3() {
  return (
    <div
      className='content-stretch flex gap-[4px] items-center relative shrink-0 w-full'
      data-name='Lock up'
    >
      <div className='basis-0 flex flex-row grow items-center self-stretch shrink-0'>
        <Connector3 />
      </div>
      <div
        className='bg-white content-stretch flex gap-[8px] items-center justify-center relative rounded-[99px] shrink-0 size-[32px]'
        data-name='1_Bubble'
      >
        <div
          aria-hidden='true'
          className='absolute border border-[#717782] border-solid inset-0 pointer-events-none rounded-[99px]'
        />
        <StepperText2 />
      </div>
      <div className='basis-0 flex flex-row grow items-center self-stretch shrink-0'>
        <ConnectorLast3 />
      </div>
    </div>
  );
}

function TextSubPage3() {
  return (
    <div
      className='content-stretch flex flex-col items-center relative shrink-0 w-full'
      data-name='Text+sub page'
    >
      <div
        className="flex flex-col font-['DM_Sans:Medium',sans-serif] font-medium justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#030b17] text-[14px] text-center text-nowrap w-full"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='[white-space-collapse:collapse] leading-[20px] overflow-ellipsis overflow-hidden'>
          Summary
        </p>
      </div>
    </div>
  );
}

function Content3() {
  return (
    <div
      className='basis-0 content-stretch flex flex-col gap-[4px] grow items-center min-h-px min-w-px relative shrink-0'
      data-name='Content'
    >
      <LockUp3 />
      <TextSubPage3 />
    </div>
  );
}

function Divider() {
  return (
    <div className='h-[17.523px] relative shrink-0 w-full' data-name='Divider'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 990 18'
      >
        <g id='Divider'>
          <line
            id='Divider_2'
            stroke='var(--stroke-0, #DEDFE1)'
            x1='0.000769231'
            x2='990'
            y1='9.02308'
            y2='7.5'
          />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className='content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full'>
      <div
        className='content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-full'
        data-name='Quick Quote stepper'
      >
        <div
          className='content-stretch flex isolate items-center justify-center relative shrink-0 w-full'
          data-name='Stepper_Horizontal /Desktop'
        >
          <div
            className='basis-0 content-stretch flex gap-[4px] grow items-start min-h-px min-w-px relative shrink-0 z-[5]'
            data-name='Steps_'
          >
            <Content />
          </div>
          <div
            className='basis-0 content-stretch flex gap-[4px] grow items-start min-h-px min-w-px relative shrink-0 z-[4]'
            data-name='Steps_'
          >
            <Content1 />
          </div>
          <div
            className='basis-0 content-stretch flex gap-[4px] grow items-start min-h-px min-w-px relative shrink-0 z-[3]'
            data-name='Steps_'
          >
            <Content2 />
          </div>
          <div
            className='basis-0 content-stretch flex gap-[4px] grow items-start min-h-px min-w-px relative shrink-0 z-[2]'
            data-name='Steps_'
          >
            <Content3 />
          </div>
        </div>
      </div>
      <Divider />
    </div>
  );
}

function Frame3() {
  return (
    <div className='absolute bg-[#e6eaf2] box-border content-stretch flex gap-[32px] items-center justify-center left-0 px-[20px] py-[16px] right-0 rounded-[6px] top-[85px]'>
      <p
        className="basis-0 font-['DM_Sans:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[14px] text-black text-center"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        Please select the benefits from below
      </p>
    </div>
  );
}

function Subtext() {
  return (
    <div
      className='absolute bottom-0 contents left-0 right-0 top-[48.41%]'
      data-name='Subtext'
    >
      <Frame3 />
      <div className='absolute inset-[48.41%_47.44%_43.95%_47.44%]'>
        <div
          className='absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0'
          style={
            { "--fill-0": "rgba(230, 234, 242, 1)" } as React.CSSProperties
          }
        >
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 22 9'
          >
            <path
              d={svgPaths.p2ddf7e80}
              fill='var(--fill-0, #E6EAF2)'
              id='Polygon 1'
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div
      className='absolute left-[calc(50%+0.5px)] size-[64px] top-0 translate-x-[-50%]'
      data-name='Avatar'
    >
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 64 64'
      >
        <g id='Avatar'>
          <circle
            cx='32'
            cy='32'
            fill='var(--fill-0, black)'
            id='Ellipse 235'
            r='32'
          />
          <path d={svgPaths.p92bd380} fill='var(--fill-0, white)' id='Vector' />
        </g>
      </svg>
    </div>
  );
}

function PageHeader() {
  return (
    <div
      className="box-border content-stretch flex font-['DM_Serif_Display:Regular',sans-serif] gap-[56px] items-center justify-center leading-[0] not-italic px-0 py-[8px] relative shrink-0 text-[#030b17] text-[18px] w-[475px]"
      data-name='Page header'
    >
      <div className='basis-0 flex flex-col grow justify-center min-h-px min-w-px relative shrink-0'>
        <p className='leading-[28px]'>Benefit selection</p>
      </div>
      <div className='basis-0 flex flex-col grow justify-center min-h-px min-w-px relative shrink-0 text-right'>
        <p className='leading-[28px]'>Step 1 / 2</p>
      </div>
    </div>
  );
}

function Object() {
  return (
    <div className='absolute inset-[12.5%]' data-name='Object'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 18 18'
      >
        <g id='Object'>
          <mask
            height='18'
            id='mask0_170_6357'
            maskUnits='userSpaceOnUse'
            style={{ maskType: "luminance" }}
            width='18'
            x='0'
            y='0'
          >
            <path
              clipRule='evenodd'
              d={svgPaths.p77ebfc0}
              fill='var(--fill-0, white)'
              fillRule='evenodd'
              id='ðIcon'
            />
          </mask>
          <g mask='url(#mask0_170_6357)'>
            <rect
              fill='var(--fill-0, #721B7C)'
              height='24'
              id='ð¨ Color'
              width='24'
              x='-3'
              y='-3'
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className='h-[24px] relative shrink-0 w-full'>
      <div className='absolute left-0 size-[24px] top-0' data-name='Checkbox'>
        <div className='absolute inset-[12.5%]' data-name='📍Icon'>
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 32 32'
          >
            <g id='ðIcon'></g>
          </svg>
        </div>
        <Object />
        <div className='absolute inset-[-33.333%]' data-name='💡States'>
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 32 32'
          >
            <g id='ð¡States'></g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className='absolute inset-[7.33%_1.95%_7.27%_2%]'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 145 129'
      >
        <g id='Group 141'>
          <path
            d={svgPaths.p1b5aacc0}
            fill='var(--fill-0, #C5DAFC)'
            id='Vector'
          />
          <path
            d={svgPaths.p2b10650}
            fill='var(--fill-0, #231F20)'
            id='Vector_2'
          />
          <path
            d={svgPaths.p2bb594c0}
            fill='var(--fill-0, #3D82F5)'
            id='Vector_3'
          />
          <path
            d={svgPaths.p252ab000}
            fill='var(--fill-0, #C5DAFC)'
            id='Vector_4'
          />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className='content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full'>
      <p className="font-['DM_Serif_Display:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#030b17] text-[18px] text-center w-full">
        Life cover benefit
      </p>
    </div>
  );
}

function Frame16() {
  return (
    <div className='h-[24px] relative shrink-0 w-full'>
      <div className='absolute left-0 size-[24px] top-0' data-name='Checkbox'>
        <div className='absolute inset-[12.5%]' data-name='📍Icon'>
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 32 32'
          >
            <g id='ðIcon'></g>
          </svg>
        </div>
        <div
          className='absolute bg-[#595f69] inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3px] mask-size-[18px_18px]'
          data-name='🎨 Color'
          style={{ maskImage: `url('${img}')` }}
        />
        <div
          className='absolute inset-[-33.333%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[11px] mask-size-[18px_18px]'
          data-name='💡States'
          style={{ maskImage: `url('${img}')` }}
        >
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 32 32'
          >
            <g id='ð¡States'></g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className='absolute inset-[10.38%_4.84%_10.35%_4.9%]'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 136 119'
      >
        <g id='Group 142'>
          <path
            d={svgPaths.p1b7c3100}
            fill='var(--fill-0, #FEC6CA)'
            id='Vector'
          />
          <path
            d={svgPaths.p1a651b00}
            fill='var(--fill-0, #231F20)'
            id='Vector_2'
          />
          <path
            d={svgPaths.p2d238b00}
            fill='var(--fill-0, #FEA1A7)'
            id='Vector_3'
          />
          <path
            d={svgPaths.p412d480}
            fill='var(--fill-0, #FEC6CA)'
            id='Vector_4'
          />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className='content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full'>
      <p className="font-['DM_Serif_Display:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#030b17] text-[18px] text-center w-full">
        Critical illness benefit
      </p>
    </div>
  );
}

function Object1() {
  return (
    <div className='absolute inset-[12.5%]' data-name='Object'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 18 18'
      >
        <g id='Object'>
          <mask
            height='18'
            id='mask0_170_6414'
            maskUnits='userSpaceOnUse'
            style={{ maskType: "luminance" }}
            width='18'
            x='0'
            y='0'
          >
            <path
              clipRule='evenodd'
              d={svgPaths.p77ebfc0}
              fill='var(--fill-0, white)'
              fillRule='evenodd'
              id='ðIcon'
            />
          </mask>
          <g mask='url(#mask0_170_6414)'>
            <rect
              fill='var(--fill-0, #721B7C)'
              height='24'
              id='ð¨ Color'
              width='24'
              x='-3'
              y='-3'
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className='h-[24px] relative shrink-0 w-full'>
      <div className='absolute left-0 size-[24px] top-0' data-name='Checkbox'>
        <div className='absolute inset-[12.5%]' data-name='📍Icon'>
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 32 32'
          >
            <g id='ðIcon'></g>
          </svg>
        </div>
        <Object1 />
        <div className='absolute inset-[-33.333%]' data-name='💡States'>
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 32 32'
          >
            <g id='ð¡States'></g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className='absolute inset-[6.03%_4.83%_6.46%_4.89%]'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 136 132'
      >
        <g id='Group 143'>
          <path
            d={svgPaths.p2b402500}
            fill='var(--fill-0, #FEE5B2)'
            id='Vector'
          />
          <path
            d={svgPaths.p23bb7a00}
            fill='var(--fill-0, #FCA800)'
            id='Vector_2'
          />
          <path
            d={svgPaths.p24d62000}
            fill='var(--fill-0, #231F20)'
            id='Vector_3'
          />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className='content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full'>
      <p className="font-['DM_Serif_Display:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#030b17] text-[18px] text-center w-full">
        Disability benefit
      </p>
    </div>
  );
}

function Frame19() {
  return (
    <div className='h-[24px] relative shrink-0 w-full'>
      <div className='absolute left-0 size-[24px] top-0' data-name='Checkbox'>
        <div className='absolute inset-[12.5%]' data-name='📍Icon'>
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 32 32'
          >
            <g id='ðIcon'></g>
          </svg>
        </div>
        <div
          className='absolute bg-[#595f69] inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3px] mask-size-[18px_18px]'
          data-name='🎨 Color'
          style={{ maskImage: `url('${img}')` }}
        />
        <div
          className='absolute inset-[-33.333%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[11px] mask-size-[18px_18px]'
          data-name='💡States'
          style={{ maskImage: `url('${img}')` }}
        >
          <svg
            className='block size-full'
            fill='none'
            preserveAspectRatio='none'
            viewBox='0 0 32 32'
          >
            <g id='ð¡States'></g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className='absolute inset-[8.67%_2.67%_8.67%_2.48%]'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 143 124'
      >
        <g id='Group 144'>
          <path
            d={svgPaths.p1d283d00}
            fill='var(--fill-0, #C9F0E8)'
            id='Vector'
          />
          <path
            d={svgPaths.p16626900}
            fill='var(--fill-0, #039E80)'
            id='Vector_2'
          />
          <path
            d={svgPaths.pc659300}
            fill='var(--fill-0, black)'
            id='Vector_3'
          />
          <path
            d={svgPaths.p1d80fe00}
            fill='var(--fill-0, #231F20)'
            id='Vector_4'
          />
          <path
            d={svgPaths.p2f570f00}
            fill='var(--fill-0, black)'
            id='Vector_5'
          />
        </g>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div className='content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full'>
      <p className="font-['DM_Serif_Display:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#030b17] text-[18px] text-center w-full">
        Income protection benefit
      </p>
    </div>
  );
}

function Frame11() {
  return (
    <div className='content-stretch flex gap-[24px] items-start relative shrink-0 w-full'>
      <div className='basis-0 bg-white grow min-h-px min-w-px relative rounded-[6px] self-stretch shrink-0'>
        <div
          aria-hidden='true'
          className='absolute border-2 border-[#721b7c] border-solid inset-0 pointer-events-none rounded-[6px]'
        />
        <div className='flex flex-col items-center size-full'>
          <div className='box-border content-stretch flex flex-col gap-[8px] items-center p-[16px] relative size-full'>
            <Frame17 />
            <div
              className='overflow-clip relative shrink-0 size-[150px]'
              data-name='Component 5'
            >
              <Group1 />
            </div>
            <Frame13 />
          </div>
        </div>
      </div>
      <div className='basis-0 bg-white grow min-h-px min-w-px relative rounded-[6px] self-stretch shrink-0'>
        <div
          aria-hidden='true'
          className='absolute border border-[#dedfe1] border-solid inset-0 pointer-events-none rounded-[6px]'
        />
        <div className='flex flex-col items-center size-full'>
          <div className='box-border content-stretch flex flex-col gap-[8px] items-center p-[16px] relative size-full'>
            <Frame16 />
            <div
              className='overflow-clip relative shrink-0 size-[150px]'
              data-name='Iconss'
            >
              <Group2 />
            </div>
            <Frame12 />
          </div>
        </div>
      </div>
      <div className='basis-0 bg-white grow min-h-px min-w-px relative rounded-[6px] self-stretch shrink-0'>
        <div
          aria-hidden='true'
          className='absolute border-2 border-[#9814af] border-solid inset-0 pointer-events-none rounded-[6px]'
        />
        <div className='flex flex-col items-center size-full'>
          <div className='box-border content-stretch flex flex-col gap-[8px] items-center p-[16px] relative size-full'>
            <Frame18 />
            <div
              className='overflow-clip relative shrink-0 size-[150px]'
              data-name='Iconss'
            >
              <Group3 />
            </div>
            <Frame14 />
          </div>
        </div>
      </div>
      <div className='basis-0 bg-white grow min-h-px min-w-px relative rounded-[6px] self-stretch shrink-0'>
        <div
          aria-hidden='true'
          className='absolute border border-[#dedfe1] border-solid inset-0 pointer-events-none rounded-[6px]'
        />
        <div className='flex flex-col items-center size-full'>
          <div className='box-border content-stretch flex flex-col gap-[8px] items-center p-[16px] relative size-full'>
            <Frame19 />
            <div
              className='overflow-clip relative shrink-0 size-[150px]'
              data-name='Iconss'
            >
              <Group4 />
            </div>
            <Frame15 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className='content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full'>
      <PageHeader />
      <Frame11 />
    </div>
  );
}

function Frame5() {
  return (
    <div className='content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full'>
      <div className='h-[157px] relative shrink-0 w-[475px]'>
        <Subtext />
        <Avatar />
      </div>
      <Frame4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className='content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full'>
      <Frame6 />
      <Frame5 />
    </div>
  );
}

function Divider1() {
  return (
    <div className='h-[17.523px] relative shrink-0 w-full' data-name='Divider'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 990 18'
      >
        <g id='Divider'>
          <line
            id='Divider_2'
            stroke='var(--stroke-0, #DEDFE1)'
            x1='0.000769231'
            x2='990'
            y1='9.02308'
            y2='7.5'
          />
        </g>
      </svg>
    </div>
  );
}

function Content4() {
  return (
    <div
      className='box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative shrink-0'
      data-name='Content'
    >
      <div className='relative shrink-0 size-[24px]' data-name='Chevron left'>
        <div className='absolute flex inset-[29.17%_37.5%_29.17%_41.67%] items-center justify-center'>
          <div className='flex-none h-[5px] rotate-[90deg] w-[10px]'>
            <div className='relative size-full' data-name='Vector'>
              <div
                className='absolute inset-0'
                style={
                  { "--fill-0": "rgba(0, 28, 86, 1)" } as React.CSSProperties
                }
              >
                <svg
                  className='block size-full'
                  fill='none'
                  preserveAspectRatio='none'
                  viewBox='0 0 10 5'
                >
                  <path
                    d='M5 5L0 0H10L5 5Z'
                    fill='var(--fill-0, #001C56)'
                    id='Vector'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col font-['DM_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#01133a] text-[18px] text-center text-nowrap"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='leading-[24px] whitespace-pre'>Back</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className='content-stretch flex gap-[16px] items-start relative shrink-0'>
      <div
        className='bg-white content-stretch flex flex-col gap-[4px] items-center relative rounded-[6px] shrink-0'
        data-name='Button L'
      >
        <div
          aria-hidden='true'
          className='absolute border border-black border-solid inset-0 pointer-events-none rounded-[6px]'
        />
        <Content4 />
      </div>
    </div>
  );
}

function Content5() {
  return (
    <div
      className='box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative shrink-0'
      data-name='Content'
    >
      <div
        className="flex flex-col font-['DM_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[18px] text-center text-nowrap text-white"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <p className='leading-[24px] whitespace-pre'>Next</p>
      </div>
      <div className='relative shrink-0 size-[24px]' data-name='Chevron right'>
        <div className='absolute bottom-1/4 flex items-center justify-center left-[41.67%] right-[37.5%] top-[33.33%]'>
          <div className='flex-none h-[5px] rotate-[90deg] scale-y-[-100%] w-[10px]'>
            <div className='relative size-full' data-name='Vector'>
              <div
                className='absolute inset-0'
                style={
                  {
                    "--fill-0": "rgba(255, 255, 255, 1)",
                  } as React.CSSProperties
                }
              >
                <svg
                  className='block size-full'
                  fill='none'
                  preserveAspectRatio='none'
                  viewBox='0 0 10 5'
                >
                  <path
                    d='M5 5L0 0H10L5 5Z'
                    fill='var(--fill-0, white)'
                    id='Vector'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className='content-stretch flex gap-[16px] items-start justify-end relative shrink-0'>
      <div
        className='bg-[#01133a] content-stretch flex flex-col gap-[4px] items-center relative rounded-[6px] shrink-0'
        data-name='Button L'
      >
        <Content5 />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className='content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full'>
      <Divider1 />
      <div
        className='content-stretch flex items-start justify-between relative shrink-0 w-full'
        data-name='Button master'
      >
        <Frame1 />
        <Frame />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className='absolute content-stretch flex flex-col h-[766px] items-center justify-between left-[calc(50%-0.5px)] top-0 translate-x-[-50%] w-[990px]'>
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Frame2() {
  return (
    <div className='absolute left-[1347px] size-[44px] top-0'>
      <svg
        className='block size-full'
        fill='none'
        preserveAspectRatio='none'
        viewBox='0 0 44 44'
      >
        <g id='Frame 49131'>
          <rect
            height='43'
            rx='21.5'
            stroke='var(--stroke-0, black)'
            strokeOpacity='0.2'
            width='43'
            x='0.5'
            y='0.5'
          />
          <path d={svgPaths.p6814b00} fill='var(--fill-0, black)' id='Vector' />
        </g>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className='basis-0 grow min-h-px min-w-px relative shrink-0 w-[1391px]'>
      <div
        className='absolute h-[77px] left-[-12px] overflow-clip top-[-10px] w-[86px]'
        data-name='Component 1'
      >
        <Group />
        <svg
          className='block size-full'
          fill='none'
          preserveAspectRatio='none'
          viewBox='0 0 32 32'
        >
          <g id='Vector'></g>
        </svg>
      </div>
      <Frame9 />
      <Frame2 />
    </div>
  );
}

function Surface() {
  return (
    <div
      className='basis-0 bg-white box-border content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px px-[24px] py-[22px] relative rounded-[6px] shadow-[0px_0px_1px_0px_rgba(3,11,23,0.3),0px_3px_5px_0px_rgba(3,11,23,0.2)] shrink-0'
      data-name='Surface'
    >
      <Frame10 />
    </div>
  );
}

export default function BasicInformation() {
  return (
    <div
      className='bg-[#f5f5f6] content-stretch flex flex-col gap-[10px] items-start relative size-full'
      data-name='Basic information'
    >
      <Surface />
    </div>
  );
}
