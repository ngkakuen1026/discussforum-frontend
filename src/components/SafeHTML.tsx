import DOMPurify from "dompurify";
import { useMemo } from "react";

interface SafeHTMLProps {
  html: string;
  className?: string;
}

const SafeHTML = ({ html, className = "" }: SafeHTMLProps) => {
  const cleanHTML = useMemo(() => {
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: [
        "allowfullscreen",
        "frameborder",
        "allow",
        "src",
        "scrolling",
        "target",
        "width",
        "height",
      ],
      ALLOWED_URI_REGEXP: /.*/,
    });
  }, [html]);

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};

export default SafeHTML;
