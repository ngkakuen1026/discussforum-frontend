import { userFollowerSortOptions } from "../../../../../utils/sortOptions";
import SortingDropdown from "../../../SortingDropdown";

interface UserFollowingSortingDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const UserFollowingSortingDropdown = ({
  value,
  onChange,
}: UserFollowingSortingDropdownProps) => {
  return (
    <SortingDropdown
      options={userFollowerSortOptions}
      value={value}
      onChange={onChange}
    />
  );
};

export default UserFollowingSortingDropdown;
