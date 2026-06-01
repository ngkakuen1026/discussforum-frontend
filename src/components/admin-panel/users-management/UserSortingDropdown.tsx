import SortingDropdown from "../SortingDropdown";
import { userSortOptions } from "../../../utils/sortOptions";

interface UserSortingDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const UserSortingDropdown = ({ value, onChange }: UserSortingDropdownProps) => {
  return (
    <SortingDropdown
      options={userSortOptions}
      value={value}
      onChange={onChange}
    />
  );
};

export default UserSortingDropdown;
