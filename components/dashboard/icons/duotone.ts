import React from 'react';

const createDuotoneIcon = (path1: React.ReactNode, path2: React.ReactNode) => (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        ...props
    }, 
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: path1 as string, className: "opacity-40"}),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: path2 as string })
    )
);

export const HomeIcon = createDuotoneIcon(
    "M6 19.5v-9.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v9.75m4.5 0v-5.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v5.25m4.5 0v-9.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v9.75",
    "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12"
);
export const CreditCardIcon = createDuotoneIcon(
    "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3",
    "M3.75 4.5h16.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H3.75a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 013.75 4.5z"
);
export const CubeIcon = createDuotoneIcon(
    "M12 21v-8.25",
    "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25M12 12.75L21 7.5"
);
export const StarIcon = createDuotoneIcon(
    "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
    "M12 17.25l-4.757 2.827 1.257-5.273-4.117-3.527.749-2.305 5.404-.433L12 3.21l2.424 5.337 5.404.433-.749 2.305-4.117 3.527 1.257 5.273L12 17.25z"
);
export const ShoppingCartIcon = createDuotoneIcon(
    "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5",
    "M11.356 8.507l1.263 12c.07.658-.463 1.243-1.117 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.116 1.007z"
);
export const DocumentTextIcon = createDuotoneIcon(
    "M12 9.75h4.5m-4.5 3h4.5m-4.5 3h4.5",
    "M2.25 8.25v9a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M2.25 8.25h5.132c1.473 0 2.668-1.195 2.668-2.668v0c0-1.473-1.195-2.668-2.668-2.668H4.5A2.25 2.25 0 002.25 5.25v3z"
);
export const BanknotesIcon = createDuotoneIcon(
    "M6.75 6.75h10.5v4.5H6.75z",
    "M4.5 4.5h15a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5zm3.75 7.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
);
export const SupportIcon = createDuotoneIcon(
    "M12 12.75a4.5 4.5 0 110-9 4.5 4.5 0 010 9z",
    "M12 21a9 9 0 100-18 9 9 0 000 18z"
);
export const LogoutIcon = createDuotoneIcon(
    "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15",
    "M12.75 12l3-3m0 0l-3-3m3 3H9"
);


// Single path icons for simplicity
const createIcon = (path: React.ReactNode) => (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        ...props
    }, path)
);

export const UserCircleIcon = createIcon(React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" }));
// FIX: Removed XMarkIcon as it's a duplicate and caused errors. It's available in outline.ts
