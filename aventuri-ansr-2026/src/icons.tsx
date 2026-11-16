import React from 'react';

export type IconName =
  | 'tent'
  | 'bolt'
  | 'box'
  | 'desk'
  | 'people'
  | 'food'
  | 'bed'
  | 'stage'
  | 'megaphone'
  | 'turtle'
  | 'sun'
  | 'moon'
  | 'castle'
  | 'camera'
  | 'chat'
  | 'magazine'
  | 'contact'
  | 'calendar'
  | 'flag'
  | 'cart'
  | 'wrench'
  | 'check'
  | 'building'
  | 'clock'
  | 'star';

const P: Record<IconName, React.ReactNode> = {
  tent: (
    <>
      <path d="M4 40 L24 8 L44 40 Z" />
      <path d="M24 8 L24 40" />
      <path d="M18 40 L24 28 L30 40" />
      <path d="M2 40 H46" />
    </>
  ),
  bolt: <path d="M27 4 L10 27 H22 L19 44 L38 19 H26 Z" />,
  box: (
    <>
      <path d="M6 16 L24 8 L42 16 V36 L24 44 L6 36 Z" />
      <path d="M6 16 L24 24 L42 16" />
      <path d="M24 24 V44" />
      <path d="M15 12 L33 20" />
    </>
  ),
  desk: (
    <>
      <rect x="6" y="20" width="36" height="8" rx="2" />
      <path d="M10 28 V42 M38 28 V42" />
      <circle cx="24" cy="10" r="5" />
    </>
  ),
  people: (
    <>
      <circle cx="16" cy="14" r="6" />
      <circle cx="33" cy="16" r="5" />
      <path d="M4 40 C4 30 10 25 16 25 C22 25 28 30 28 40" />
      <path d="M26 28 C28 26 30 25 33 25 C39 25 44 29 44 38" />
    </>
  ),
  food: (
    <>
      <path d="M14 6 V42 M9 6 V16 C9 20 19 20 19 16 V6" />
      <path d="M34 42 V6 C28 8 27 18 27 24 H34" />
    </>
  ),
  bed: (
    <>
      <path d="M4 12 V40 M4 32 H44 V40" />
      <path d="M4 26 H44 V32" />
      <rect x="9" y="18" width="10" height="8" rx="2" />
      <path d="M22 26 V20 H38 C42 20 44 22 44 26" />
    </>
  ),
  stage: (
    <>
      <path d="M4 36 H44 V42 H4 Z" />
      <path d="M4 8 H44" />
      <path d="M4 8 C8 18 6 28 8 36 M44 8 C40 18 42 28 40 36" />
      <path d="M24 14 L26.5 19 L32 19.8 L28 23.6 L29 29 L24 26.4 L19 29 L20 23.6 L16 19.8 L21.5 19 Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M8 20 H16 L36 10 V38 L16 28 H8 Z" />
      <path d="M14 28 L18 40 H24 L21 29" />
      <path d="M41 18 C44 21 44 27 41 30" />
    </>
  ),
  turtle: (
    <>
      <path d="M8 32 C8 20 16 14 24 14 C32 14 40 20 40 32 Z" />
      <path d="M40 30 C44 30 46 27 46 24 C46 22 44 21 42 22" />
      <path d="M12 32 L10 38 M20 32 L19 38 M28 32 L29 38 M36 32 L38 38" />
      <path d="M16 24 L24 18 L32 24 L24 30 Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="24" cy="24" r="8" />
      <path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M10 10 L14 14 M34 34 L38 38 M38 10 L34 14 M14 34 L10 38" />
    </>
  ),
  moon: (
    <>
      <path d="M32 6 C20 8 14 18 16 28 C18 38 30 44 40 38 C30 38 22 30 22 20 C22 14 26 9 32 6 Z" />
      <path d="M38 12 L39 15 L42 16 L39 17 L38 20 L37 17 L34 16 L37 15 Z" />
    </>
  ),
  castle: (
    <>
      <path d="M6 42 V18 L12 12 L18 18 V24 L24 18 L30 24 V18 L36 12 L42 18 V42 Z" />
      <path d="M18 42 V34 C18 30 30 30 30 34 V42" />
      <path d="M12 12 V6 M36 12 V6" />
    </>
  ),
  camera: (
    <>
      <path d="M4 16 H14 L18 10 H30 L34 16 H44 V40 H4 Z" />
      <circle cx="24" cy="27" r="8" />
    </>
  ),
  chat: (
    <>
      <path d="M4 8 H30 V26 H14 L8 32 V26 H4 Z" />
      <path d="M34 16 H44 V34 H40 V40 L34 34 H18 V30" />
    </>
  ),
  magazine: (
    <>
      <rect x="10" y="4" width="28" height="40" rx="2" />
      <path d="M15 11 H33 M15 17 H27" />
      <rect x="15" y="22" width="18" height="12" />
      <path d="M15 39 H33" />
    </>
  ),
  contact: (
    <>
      <rect x="12" y="4" width="24" height="40" rx="4" />
      <circle cx="24" cy="18" r="5" />
      <path d="M16 32 C16 26 32 26 32 32" />
      <path d="M21 39 H27" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="10" width="40" height="34" rx="3" />
      <path d="M4 20 H44 M14 4 V14 M34 4 V14" />
      <path d="M16 31 L22 37 L33 26" />
    </>
  ),
  flag: (
    <>
      <path d="M10 44 V4" />
      <path d="M10 6 H38 L32 15 L38 24 H10" />
    </>
  ),
  cart: (
    <>
      <path d="M2 6 H10 L15 32 H38 L43 14 H12" />
      <circle cx="18" cy="40" r="3" />
      <circle cx="35" cy="40" r="3" />
    </>
  ),
  wrench: (
    <>
      <path d="M30 6 C24 6 20 12 22 18 L6 34 L14 42 L30 26 C36 28 42 24 42 18 L36 22 L30 18 L30 12 L34 8 C33 6 31 6 30 6 Z" />
    </>
  ),
  check: <path d="M8 25 L19 36 L40 13" />,
  building: (
    <>
      <path d="M6 42 H42" />
      <path d="M10 42 V18 L24 8 L38 18 V42" />
      <path d="M16 24 V36 M24 24 V36 M32 24 V36" />
      <path d="M13 20 H35" />
    </>
  ),
  clock: (
    <>
      <circle cx="24" cy="24" r="19" />
      <path d="M24 12 V24 L32 30" />
    </>
  ),
  star: (
    <path d="M24 5 L29.5 17 L42.5 18.5 L32.8 27.4 L35.6 40.4 L24 33.8 L12.4 40.4 L15.2 27.4 L5.5 18.5 L18.5 17 Z" />
  ),
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  draw?: number; // 0..1 stroke reveal
}> = ({name, size = 48, color = '#fff', strokeWidth = 3, draw = 1}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{display: 'block', overflow: 'visible'}}
    >
      <g
        pathLength={1}
        style={{
          strokeDasharray: 200,
          strokeDashoffset: 200 * (1 - draw),
        }}
      >
        {P[name]}
      </g>
    </svg>
  );
};
