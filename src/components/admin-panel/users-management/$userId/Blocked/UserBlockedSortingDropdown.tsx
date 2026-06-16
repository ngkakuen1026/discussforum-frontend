import SortingDropdown from "../../../SortingDropdown";
import { userBlockedSortOptions } from "../../../../../utils/sortOptions";

interface UserBlockedSortingDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const UserBlockedSortingDropdown = ({
  value,
  onChange,
}: UserBlockedSortingDropdownProps) => {
  return (
    <SortingDropdown
      options={userBlockedSortOptions}
      value={value}
      onChange={onChange}
    />
  );
};
export default UserBlockedSortingDropdown;
