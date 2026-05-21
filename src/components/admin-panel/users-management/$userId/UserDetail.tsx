import { Link, useParams } from "@tanstack/react-router";
import AdminPanelBreadCrumb from "../../AdminPanelBreadCrumb";
import authAxios from "../../../../services/authAxios";
import { adminAPI } from "../../../../services/http-api";
import type { UserType } from "../../../../types/userTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateUsername,
} from "../../../../utils/validationUtils";
import UserDetailActions from "./UserDetailActions";
import UserInformation from "./UserInformation";
import UserImages from "./UserImages";
import UserHeader from "./UserHeader";
import UserActivity from "./UserActivity/UserActivity";
import UserPermission from "./UserPermission/UserPermission";

const UserDetail = () => {
  const { userId } = useParams({
    from: "/admin-panel/users-management/$userId",
  });
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const [adminInput, setAdminInput] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    bio: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserType>({
    queryKey: ["admin-user-profile", userId],
    queryFn: async () => {
      const res = await authAxios.get(
        `${adminAPI.url}/users/user/profile/${userId}`,
      );
      return res.data.user;
    },
    staleTime: 5 * 60 * 1000,
  });

  const refreshUserData = () => {
    queryClient.invalidateQueries({ queryKey: ["ban-status"] });
    queryClient.invalidateQueries({ queryKey: ["admin-user-profile"] });
    queryClient.invalidateQueries({ queryKey: ["public-user-posts"] });
    queryClient.invalidateQueries({ queryKey: ["public-user-comments"] });
    queryClient.invalidateQueries({ queryKey: ["public-user-votes"] });
    queryClient.invalidateQueries({ queryKey: ["public-user-followers"] });
    queryClient.invalidateQueries({ queryKey: ["public-user-followings"] });
    queryClient.invalidateQueries({ queryKey: ["public-user-blocked"] });
    toast.success(`User Data Refreshed!`);
  };

  // Sync form when user data loads
  useEffect(() => {
    if (user) {
      setAdminInput({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        bio: user.bio || "",
      });
      setErrors({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof adminInput) => {
      const res = await authAxios.patch(
        `${adminAPI.url}/users/user/profile/${userId}`,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-user-profile", userId],
      });
      toast.success("User updated successfully");
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const validateForm = (): boolean => {
    const newErrors = {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    };

    const usernameResult = validateUsername(adminInput.username);
    const firstNameResult = validateFirstName(adminInput.first_name);
    const lastNameResult = validateLastName(adminInput.last_name);
    const emailResult = validateEmail(adminInput.email);
    const phoneResult = validatePhone(adminInput.phone);

    newErrors.username = usernameResult.error || "";
    newErrors.first_name = firstNameResult.error || "";
    newErrors.last_name = lastNameResult.error || "";
    newErrors.email = emailResult.error || "";
    newErrors.phone = phoneResult.error || "";

    setErrors(newErrors);

    return Object.values(newErrors).every((err) => err === "");
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAdminInput((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBioChange = (html: string) => {
    setAdminInput((prev) => ({ ...prev, bio: html }));
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    updateMutation.mutate(adminInput);
  };

  const handleCancel = () => {
    if (user) {
      setAdminInput({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        bio: user.bio || "",
      });
    }
    setErrors({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    });
    setIsEditing(false);
  };
  if (isLoading)
    return <div className="p-8 text-gray-400">Loading user profile...</div>;
  if (isError || !user)
    return <div className="p-8 text-red-400">Failed to load user</div>;

  return (
    <div>
      <AdminPanelBreadCrumb>
        <Link
          to="/admin-panel/users-management"
          className="hover:text-gray-200 hover:underline"
        >
          Users Management
        </Link>{" "}
        &gt; User Detail
      </AdminPanelBreadCrumb>

      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl">
        {/* Header */}
        <UserHeader user={user} refreshUserData={refreshUserData} />

        {/* User Informations */}
        <UserDetailActions
          isEditing={isEditing}
          isSaving={updateMutation.isPending}
          onEdit={toggleEditing}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <div className="pb-8 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <UserInformation
              user={user}
              adminInput={adminInput}
              setAdminInput={setAdminInput}
              errors={errors}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              handleBioChange={handleBioChange}
            />

            <UserImages user={user} isEditing={isEditing} />
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {/* User Activity */}
            <UserActivity />
            {/* User Permissions */}
            <UserPermission user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
