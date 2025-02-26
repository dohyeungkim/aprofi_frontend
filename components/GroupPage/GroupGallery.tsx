"use client";

import { useRouter } from "next/navigation";
interface Group {
  group_id: number;
  group_name: string;
  group_owner: string;
  group_private_state: boolean;
  member_count: number;
  createdAt?: string;
  is_member: boolean;
}

interface GroupListProps {
  groups: Group[];
}
export default function GroupList({ groups }: GroupListProps) {
  const router = useRouter();

  const filteredGroups = groups.filter((group) => group.is_member);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-2">
  {filteredGroups.map((group) => (
    <div
      key={group.group_id}
      onClick={() => router.push(`/mygroups/${group.group_id}`)}
      className="flex flex-col relative border border-gray-200 rounded-2xl p-4 sm:p-6 cursor-pointer 
                 shadow-md transition-all duration-300 ease-in-out
                 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300 
                 bg-white text-gray-800 h-full"
    >
      {/* ✅ 그룹 상태 배지 (공개 / 비공개) */}
      <div
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold 
                    ${
                      group.group_private_state
                        ? "bg-gray-400 text-white"
                        : "bg-blue-500 text-white"
                    }`}
      >
        {group.group_private_state ? "비공개" : "공개"}
      </div>

      {/* ✅ 그룹 정보 */}
      <div className="flex-grow">
        <h2 className="text-xl font-semibold mb-2">
          {group.group_name.length > 8
            ? `${group.group_name.slice(0, 8)}...`
            : group.group_name}
        </h2>
        <p className="mb-1">📌 그룹 번호: {group.group_id}</p>
        <p className="mb-1">👥 수강생: {group.member_count}명</p>

        <div className="flex justify-between items-center text-sm font-semibold mt-3 mb-3">
          <span>👨‍🏫 그룹장: {group.group_owner}</span>
        </div>
      </div>

      {/* ✅ 그룹 입장 버튼 (하단 고정) */}
      <button className="mt-auto  w-full py-2 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out active:scale-95 bg-gray-800 text-white hover:bg-gray-700">
        들어가기
      </button>
    </div>
  ))}
</section>

  );
}
