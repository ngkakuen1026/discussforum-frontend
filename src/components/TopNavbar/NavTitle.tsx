import { Link } from "@tanstack/react-router";

const NavTitle = () => {
  return (
    <div className="flex gap-4">
      <Link
        to="/"
        search={{ categoryId: 0 }}
        replace={true}
        className="flex items-center text-3xl"
      >
        <img src="/src/assets/icon.svg" className="w-20 h-20" />
        <span className="text-orange-600 dark:text-white font-extrabold">
          ChatterNest
        </span>
      </Link>
    </div>
  );
};

export default NavTitle;
