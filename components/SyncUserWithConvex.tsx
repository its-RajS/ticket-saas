import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const SyncUserWithConvex = () => {
  const { user } = useUser();
  //! const updateUser = useMutation(api.user.updateUser);

  useEffect(() => {
    if (!user) return null;

    const syncUser = async () => {
      try {
        await updateUser({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        });
      } catch (error) {
        console.log(error);
      }
    };
    syncUser();
  }, [user, updateUser]);

  return null;
};

export default SyncUserWithConvex;
