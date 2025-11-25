import React from 'react';

interface StructuredDataProps {
    data: any | any[];
}

/**
 * Component to inject structured data (JSON-LD) into the page
 * Used for rich snippets in search results
 */
const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
    const dataArray = Array.isArray(data) ? data : [data];

    return (
        <>
            {dataArray.map((schemaData, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />
            ))}
        </>
    );
};

export default StructuredData;
