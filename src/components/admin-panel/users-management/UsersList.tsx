import UserRow from "./UserRow";
import type { ExtendedUserType } from "../../../types/userTypes";
import { CircleQuestionMark, ListCollapse } from "lucide-react";

interface UsersListProps {
  users: ExtendedUserType[];
  isLoading: boolean;
  search: string;
}

const UsersList = ({ users = [], isLoading, search }: UsersListProps) => {
  return (
    <div>
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No users found matching "{search}"
        </div>
      ) : (
        <div>
          <table className="w-full min-w-full border border-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  <ListCollapse size={16} />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 flex gap-1 items-start">
                  Role
                  <button className="relative group cursor-pointer">
                    <CircleQuestionMark
                      size={14}
                      className="hover:text-white transition"
                    />
                    <p className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                      <span className="text-yellow-600/80">Orange</span> = Admin
                      <br />
                      <span className="text-blue-600/80">Blue</span> = Male
                      <br />
                      <span className="text-pink-600/80">Pink</span> = Female
                      <br />
                      <span className="text-gray-600/80">Gray</span> = No Gender
                      Specified
                    </p>
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Registered
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user: ExtendedUserType) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;
