import SortingDropdown from "../../../SortingDropdown";
import { userBlockedSortOptions } from "../../../../../utils/sortOptions";

interface UserBlockerSortingDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const UserBlockerSortingDropdown = ({
  value,
  onChange,
}: UserBlockerSortingDropdownProps) => {
  return (
    <SortingDropdown
      options={userBlockedSortOptions}
      value={value}
      onChange={onChange}
    />
  );
};
export default UserBlockerSortingDropdown;
