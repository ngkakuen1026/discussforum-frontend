import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export const MarkdownContent = ({ children }: { children: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeSanitize]}
    components={{
      // Auto-embed YouTube
      a: ({ href, children }) => {
        if (!href) return <a href={href}>{children}</a>;
        const yt = href.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
        );
        if (yt) {
          return (
            <div className="my-6">
              <iframe
                src={`https://www.youtube.com/embed/${yt[1]}`}
                allowFullScreen
                className="w-full aspect-video rounded-lg"
                title="YouTube video"
              />
            </div>
          );
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline"
          >
            {children}
          </a>
        );
      },
      img: ({ src, alt }) => (
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg my-4"
          loading="lazy"
        />
      ),
    }}
  >
    {children}
  </ReactMarkdown>
);
