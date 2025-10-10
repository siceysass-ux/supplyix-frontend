import React from 'react';

// FIX: Replaced JSX with React.createElement to be compatible with .ts files.
const createIcon = (path: React.ReactNode) => (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        ...props
    }, path)
);

// FIX: Replaced JSX with React.createElement and wrapped multiple paths in React.Fragment
// to be compatible with .ts files.
export const BellIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { fillRule: "evenodd", d: "M11.58 3.53a.75.75 0 00-1.06 1.06l.75.75a3.745 3.745 0 005.992 5.992l.75.75a.75.75 0 101.06-1.06l-1.148-1.147a5.25 5.25 0 01-7.424-7.424l-1.148-1.147zM12 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z", clipRule: "evenodd" }),
    React.createElement('path', { d: "M10.5 18.75a.75.75 0 001.5 0v-2.138a3.746 3.746 0 00-1.5 0v2.138zM12 15.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008A.75.75 0 0112 15.75v-.008zM12 15a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008A.75.75 0 0012.008 15H12z" }),
    React.createElement('path', { fillRule: "evenodd", d: "M10.493 17.21l-.001-.002-.002-.001a1.5 1.5 0 01-.06-2.119l.06-.06a1.5 1.5 0 012.119.06l.001.002.002.001a1.5 1.5 0 01.06 2.119l-.06.06a1.5 1.5 0 01-2.119-.06z", clipRule: "evenodd" }),
    React.createElement('path', { d: "M5.25 12a.75.75 0 01.75-.75h2.138a3.746 3.746 0 000 1.5H6a.75.75 0 01-.75-.75zM15.862 12a3.746 3.746 0 000-1.5h2.138a.75.75 0 010 1.5h-2.138zM5.33 17.21a1.5 1.5 0 002.119.06l.001-.001.002-.002a1.5 1.5 0 00.06-2.119l-.06-.06a1.5 1.5 0 00-2.119.06l-.001.001-.002.002a1.5 1.5 0 00-.06 2.119l.06.06z", clipRule: "evenodd" })
));
export const UserCircleIcon = createIcon(React.createElement('path', { fillRule: "evenodd", d: "M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z", clipRule: "evenodd" }));
export const StarIcon = createIcon(React.createElement('path', { fillRule: "evenodd", d: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.757 2.827c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z", clipRule: "evenodd" }));
