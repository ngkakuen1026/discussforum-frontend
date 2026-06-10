import { userFollowerSortOptions } from "../../../../../utils/sortOptions";
import SortingDropdown from "../../../SortingDropdown";

interface UserFollowersSortingDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const UserFollowersSortingDropdown = ({
  value,
  onChange,
}: UserFollowersSortingDropdownProps) => {
  return (
    <SortingDropdown
      options={userFollowerSortOptions}
      value={value}
      onChange={onChange}
    />
  );
};

export default UserFollowersSortingDropdown;
