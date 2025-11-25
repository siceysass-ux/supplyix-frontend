import React, { useEffect } from 'react';

interface SEOHeadProps {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
    noindex?: boolean;
    structuredData?: any | any[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
    title,
    description,
    keywords = [],
    ogImage = '/logo.png',
    canonical,
    noindex = false,
    structuredData,
}) => {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Helper function to update or create meta tag
        const updateMetaTag = (selector: string, attribute: string, content: string) => {
            let element = document.querySelector(selector) as HTMLMetaElement;
            if (!element) {
                element = document.createElement('meta');
                if (selector.includes('property=')) {
                    element.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
                } else if (selector.includes('name=')) {
                    element.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
                }
                document.head.appendChild(element);
            }
            element.setAttribute(attribute, content);
        };

        // Update meta description
        updateMetaTag('meta[name="description"]', 'content', description);

        // Update meta keywords
        if (keywords.length > 0) {
            updateMetaTag('meta[name="keywords"]', 'content', keywords.join(', '));
        }

        // Update robots meta tag
        if (noindex) {
            updateMetaTag('meta[name="robots"]', 'content', 'noindex, nofollow');
        } else {
            updateMetaTag('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        }

        // Open Graph tags
        updateMetaTag('meta[property="og:title"]', 'content', title);
        updateMetaTag('meta[property="og:description"]', 'content', description);
        updateMetaTag('meta[property="og:type"]', 'content', 'website');
        updateMetaTag('meta[property="og:locale"]', 'content', 'tr_TR');

        if (ogImage) {
            const fullImageUrl = ogImage.startsWith('http') ? ogImage : `https://www.supplyix.com${ogImage}`;
            updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
            updateMetaTag('meta[property="og:image:width"]', 'content', '1200');
            updateMetaTag('meta[property="og:image:height"]', 'content', '630');
            updateMetaTag('meta[property="og:image:alt"]', 'content', 'Supplyix - Dropshipping Türkiye');
        }

        if (canonical) {
            updateMetaTag('meta[property="og:url"]', 'content', canonical);
        }

        // Twitter Card tags
        updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
        updateMetaTag('meta[name="twitter:title"]', 'content', title);
        updateMetaTag('meta[name="twitter:description"]', 'content', description);

        if (ogImage) {
            const fullImageUrl = ogImage.startsWith('http') ? ogImage : `https://www.supplyix.com${ogImage}`;
            updateMetaTag('meta[name="twitter:image"]', 'content', fullImageUrl);
            updateMetaTag('meta[name="twitter:image:alt"]', 'content', 'Supplyix - Dropshipping Türkiye');
        }

        // Canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (canonical) {
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.href = canonical;
        } else if (canonicalLink) {
            canonicalLink.remove();
        }

        // Structured Data (JSON-LD)
        // Remove existing structured data scripts
        const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
        existingScripts.forEach(script => {
            if (script.getAttribute('data-seo-head') === 'true') {
                script.remove();
            }
        });

        // Add new structured data
        if (structuredData) {
            const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
            dataArray.forEach((data) => {
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.setAttribute('data-seo-head', 'true');
                script.text = JSON.stringify(data);
                document.head.appendChild(script);
            });
        }

        // Additional SEO meta tags
        updateMetaTag('meta[name="author"]', 'content', 'Supplyix');
        updateMetaTag('meta[name="language"]', 'content', 'Turkish');
        updateMetaTag('meta[name="geo.region"]', 'content', 'TR');
        updateMetaTag('meta[name="geo.placename"]', 'content', 'Türkiye');

    }, [title, description, keywords, ogImage, canonical, noindex, structuredData]);

    return null; // This component doesn't render anything
};

export default SEOHead;
