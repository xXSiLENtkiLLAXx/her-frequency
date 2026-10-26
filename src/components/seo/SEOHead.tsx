import { Helmet } from "react-helmet-async";

const SITE_URL = "https://her-frequency.lovable.app";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

/**
 * Per-route head tags. Canonical and og:url always point at the route's own
 * URL so each page is identified by itself, never the homepage.
 */
export const SEOHead = ({ title, description, path, noIndex = false }: SEOHeadProps) => {
  const url = `${SITE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};
