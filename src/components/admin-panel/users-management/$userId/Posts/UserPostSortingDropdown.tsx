import { postSortOptions } from "../../../../../utils/sortOptions";
import SortingDropdown from "../../../SortingDropdown";

interface UserPostSortingDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const UserPostSortingDropdown = ({
  value,
  onChange,
}: UserPostSortingDropdownProps) => {
  return (
    <SortingDropdown
      options={postSortOptions}
      value={value}
      onChange={onChange}
    />
  );
};

export default UserPostSortingDropdown;
