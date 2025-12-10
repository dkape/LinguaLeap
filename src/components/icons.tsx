import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12l1.25 1.25a2.83 2.83 0 1 0 4-4L4 8" />
      <path d="M11.5 11.5 6 6" />
      <path d="m20 12-7-7" />
    </svg>
  );
}
