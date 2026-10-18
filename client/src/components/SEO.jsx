
import { Helmet } from "react-helmet-async";

const SITE_NAME = "CodingBhai";
const SITE_URL = "https://codingbhai.online";

function SEO({
  title,
  description,
  path = "/",
  noindex = false,
}) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow"
        }
      />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
    </Helmet>
  );
}

export default SEO;
