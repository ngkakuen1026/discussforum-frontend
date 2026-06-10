import { CircleQuestionMark, ListCollapse } from "lucide-react";
import type { UserFollowerType } from "../../../../../types/userFollowTypes";
import UserFollowerRow from "./UserFollowerRow";

interface UserFollowerListProps {
  userFollowers: UserFollowerType[];
  isLoading: boolean;
  userId: string;
  username: string;
}

const UserFollowerList = ({
  userFollowers,
  isLoading,
  userId,
  username,
}: UserFollowerListProps) => {
  console.log(userFollowers);

  if (isLoading)
    return (
      <div className="text-center py-8 text-gray-400">
        Loading User Followers...
      </div>
    );

  if (userFollowers.length === 0)
    return (
      <div className="text-center py-8 text-gray-400">No Followers found.</div>
    );

  return (
    <div className="">
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
              Followed At
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
          {userFollowers.map((userFollower: UserFollowerType) => (
            <UserFollowerRow
              key={userFollower.follower_user_id}
              follower={userFollower}
              userId={userId}
              username={username}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserFollowerList;
