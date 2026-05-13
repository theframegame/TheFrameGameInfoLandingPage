import { useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface MetaTags {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export function MetaTagsLoader() {
  useEffect(() => {
    const loadMetaTags = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/meta-tags`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const tags: MetaTags = data.metaTags || {};

          // Update document title
          if (tags.title) {
            document.title = tags.title;
          }

          // Helper function to update or create meta tag
          const updateMetaTag = (name: string, content: string, property?: string) => {
            if (!content) return;

            const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
            let tag = document.querySelector(selector) as HTMLMetaElement;
            
            if (!tag) {
              tag = document.createElement('meta');
              if (property) {
                tag.setAttribute('property', property);
              } else {
                tag.setAttribute('name', name);
              }
              document.head.appendChild(tag);
            }
            
            tag.setAttribute('content', content);
          };

          // Update meta description
          updateMetaTag('description', tags.description || '');

          // Update Open Graph tags
          updateMetaTag('og:title', tags.title || '', 'og:title');
          updateMetaTag('og:description', tags.description || '', 'og:description');
          updateMetaTag('og:image', tags.image || '', 'og:image');
          updateMetaTag('og:type', 'website', 'og:type');
          updateMetaTag('og:url', window.location.href, 'og:url');

          // Update Twitter Card tags
          updateMetaTag('twitter:card', tags.twitterCard || 'summary_large_image');
          updateMetaTag('twitter:title', tags.title || '');
          updateMetaTag('twitter:description', tags.description || '');
          updateMetaTag('twitter:image', tags.image || '');

          // Update favicon
          if (tags.favicon) {
            let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = tags.favicon;
          }
        }
      } catch (error) {
        console.error('Error loading meta tags:', error);
      }
    };

    loadMetaTags();
  }, []);

  return null; // This component doesn't render anything
}
