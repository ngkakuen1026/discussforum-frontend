import React, { type Dispatch, type SetStateAction } from "react";
import type { UserType } from "../../../../types/userTypes";
import GenderDropdown from "../GenderDropdown";
import TiptapEditor from "../../../TiptapEditor/TiptapEditor";
import SafeHTML from "../../../SafeHTML";
import {
  formatUserLastLoginDate,
  formatUserRegistrationDate,
} from "../../../../utils/dateUtils";

interface AdminInput {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  bio: string;
}

interface UserInformationProps {
  user: UserType;
  adminInput: AdminInput;
  setAdminInput: Dispatch<SetStateAction<AdminInput>>;
  errors: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBioChange: (html: string) => void;
}

const UserInformation = ({
  user,
  adminInput,
  setAdminInput,
  errors,
  isEditing,
  handleInputChange,
  handleBioChange,
}: UserInformationProps) => {
  return (
    <div className="space-y-8">
      {/* Username */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 text-lg text-gray-400">Username</div>
        <div className="col-span-8">
          {isEditing ? (
            <input
              name="username"
              value={adminInput.username}
              onChange={handleInputChange}
              className={`w-full font-medium text-lg bg-gray-900 border rounded-lg px-4 py-2.5 focus:outline-none ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-700 focus:border-cyan-500"
              }`}
            />
          ) : (
            <div className="font-medium text-lg py-2.5">{user.username}</div>
          )}
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">{errors.username}</p>
          )}
        </div>
      </div>

      {/* First Name */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 text-lg text-gray-400">First Name</div>
        <div className="col-span-8">
          {isEditing ? (
            <input
              name="first_name"
              value={adminInput.first_name}
              onChange={handleInputChange}
              className={`w-full font-medium text-lg bg-gray-900 border rounded-lg px-4 py-2.5 focus:outline-none ${
                errors.first_name
                  ? "border-red-500"
                  : "border-gray-700 focus:border-cyan-500"
              }`}
            />
          ) : (
            <div className="font-medium text-lg py-2.5">
              {user.first_name || "—"}
            </div>
          )}
          {errors.first_name && (
            <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>
      </div>

      {/* Last Name */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 text-lg text-gray-400">Last Name</div>
        <div className="col-span-8">
          {isEditing ? (
            <input
              name="last_name"
              value={adminInput.last_name}
              onChange={handleInputChange}
              className={`w-full font-medium text-lg bg-gray-900 border rounded-lg px-4 py-2.5 focus:outline-none ${
                errors.last_name
                  ? "border-red-500"
                  : "border-gray-700 focus:border-cyan-500"
              }`}
            />
          ) : (
            <div className="font-medium text-lg py-2.5">
              {user.last_name || "—"}
            </div>
          )}
          {errors.last_name && (
            <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 text-lg text-gray-400">
          Registration Email
        </div>
        <div className="col-span-8">
          {isEditing ? (
            <input
              name="email"
              value={adminInput.email}
              onChange={handleInputChange}
              className={`w-full font-medium text-lg bg-gray-900 border rounded-lg px-4 py-2.5 focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-700 focus:border-cyan-500"
              }`}
            />
          ) : (
            <div className="font-medium text-lg py-2.5">{user.email}</div>
          )}
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 text-lg text-gray-400">Phone</div>
        <div className="col-span-8">
          {isEditing ? (
            <input
              name="phone"
              value={adminInput.phone}
              onChange={handleInputChange}
              className={`w-full font-medium text-lg bg-gray-900 border rounded-lg px-4 py-2.5 focus:outline-none ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-700 focus:border-cyan-500"
              }`}
            />
          ) : (
            <div className="font-medium text-lg py-2.5">
              {user.phone || "—"}
            </div>
          )}
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Gender */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 text-lg text-gray-400">Gender</div>
        <div className="col-span-8">
          {isEditing ? (
            <GenderDropdown
              value={adminInput.gender || ""}
              onChange={(value) =>
                setAdminInput((prev) => ({ ...prev, gender: value }))
              }
            />
          ) : (
            <div className="font-medium text-lg py-2.5">
              {user.gender || "Not Provided"}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-4 text-lg text-gray-400 pt-2">Bio</div>
        <div className="col-span-8">
          {isEditing ? (
            <TiptapEditor
              content={adminInput.bio || ""}
              onChange={handleBioChange}
              placeholder="Write something about this user..."
              variant="bio"
              maxLength={400}
            />
          ) : (
            <div className="col-span-8 text-lg leading-relaxed">
              <SafeHTML html={user.bio} />
            </div>
          )}
        </div>
      </div>

      {/* Registration Date */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 text-lg text-gray-400">
          Registration Date
        </div>
        <div className="col-span-8 font-medium text-lg">
          {formatUserRegistrationDate(user.registration_date)}
        </div>
      </div>

      {/* Last Login */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 text-lg text-gray-400">Last Login</div>
        <div className="col-span-8 font-medium text-lg">
          {formatUserLastLoginDate(user.last_login_at)}
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
