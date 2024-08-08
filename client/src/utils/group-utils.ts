import { GroupsType } from "@/states/chat-state";
import { UserType } from "@/states/user-state";

export const resolveName = (group: GroupsType, user: UserType) => {
  if (group.personal) {
    const name = group.name.split(" ").filter((name) => name !== user?.name);
    return name;
  }
  return group.name;
};

export const resolveDate = (date: string) => {
  const d = new Date(date);
  return d.toDateString();
};

export const resolveDP = (group: GroupsType, user: UserType): string => {
  if (!group.personal) return `/avatars/group-icon.png`;
  const friend = group.GroupMembers.find(
    (member) => member.user_id !== user?.id
  );
  return `/avatars/${friend?.user.avatar || 1}.jpeg`;
};
