import { useUserStore } from "~/db/userStore";

export const UserInfo = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex flex-col items-center gap-2 py-8 mint-main-bg">
      <div className="border-3 border-[var(--button-color)] rounded-full">
        <div
          className="w-16 h-16 rounded-full bg-gray-700 border-2 border-[var(--bg-color)]"
          style={{
            backgroundImage: `url(${user.photoUrl})`,
            backgroundSize: "cover",
          }}
        ></div>
      </div>
      <div className="font-medium text-2xl">@{user.username}</div>
    </div>
  );
};
