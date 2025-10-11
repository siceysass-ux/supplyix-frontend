import React from 'react';

const createIcon = (path: React.ReactNode, path2?: React.ReactNode) => (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        ...props
    }, path, path2 ? path2 : null)
);

export const ArchiveBoxIcon = createIcon(
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 21h16.5M16.5 3.75h.008v.008H16.5V3.75zM12 3.75h.008v.008H12V3.75zM7.5 3.75h.008v.008H7.5V3.75z" }),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 8.25h3" })
);

export const TrashIcon = createIcon(React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" }));

export const EnvelopeOpenIcon = createIcon(React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488a2.25 2.25 0 01-2.18 0l-6.478-3.488A2.25 2.25 0 012.25 9.906V9m19.5 0a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 9m19.5 0v12a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V9m15-3.75l-6.25 3.369a2.25 2.25 0 01-2.18 0L3 5.25" }));

export const EnvelopeIcon = createIcon(React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" }));

export const InboxIcon = createIcon(React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v10.5m0 0l-3-3m3 3l3-3" }));
