import { useEffect, useRef } from "react";

interface ClickOutsideProps {
  children: React.ReactNode;
  onClickOutside: () => void;
  className?: string;
}

const ClickOutside = ({
  children,
  onClickOutside,
  className,
}: ClickOutsideProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClickOutside]);

  return (
    <div ref={ref} className={`contents ${className ?? ""}`}>
      {children}
    </div>
  );
};

export default ClickOutside;
