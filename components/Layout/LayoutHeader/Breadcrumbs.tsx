"use client";

import Link from "next/link";
interface BreadcrumbsProps {
  pathname: string;
  group?: { group_name: string };
  groupId?: string;
  exam?: { workbook_name: string };
  examId?: string;
  problem?: { title: string };
  problemId?: string;
}

export default function Breadcrumbs({ pathname, group, exam, problem }: BreadcrumbsProps) {
  // URL 세그먼트 분리
  const segments = pathname.split("/").filter(Boolean);

  // `mygroups` 경로가 아닌 경우 Breadcrumb 표시 X
  if (segments.includes("mygroups")) {
    return (
      <nav className="text-gray-500 text-sm mb-2">
        {/* 🔹 나의 그룹들 (홈) */}
        <BreadcrumbLink href="/mygroups" label="🏡 나의 그룹들" />

        {/* 🔹 나의 그룹 */}
        {segments.length >= 2 && group && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbLink
              href={`/mygroups/${segments[1]}`}
              label={`📚 ${group?.group_name || "나의 그룹"}`}
            />
          </>
        )}

        {/* 🔹 나의 문제지 */}
        {segments.length >= 4 && exam && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbLink
              href={`/mygroups/${segments[1]}/exams/${segments[3]}`}
              label={`📄 ${exam?.workbook_name || "나의 문제지"}`}
            />
          </>
        )}

        {/* 🔹 문제 */}
        {segments.length >= 6 && problem && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbLink
              href={`/mygroups/${segments[1]}/exams/${segments[3]}/problems/${segments[5]}`}
              label={`✏️ ${problem?.title || "문제 정보"}`}
            />
          </>
        )}

        {/* 🔹 도전하기 */}
        {pathname.includes("/write") && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbLink href={pathname} label="🔥 도전하기" />
          </>
        )}

        {/* 🔹 채점 결과 (결과 페이지 - `/result`) */}
        {segments.length >= 7 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbLink
              href={`/mygroups/${segments[1]}/exams/${segments[3]}/problems/${segments[5]}/result`}
              label="🏆 채점 결과"
            />
          </>
        )}

        {/* 🔹 채점 결과 상세 페이지 (결과 상세 - `/result/{id}`) */}
        {segments.length >= 8 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbLink href={pathname} label="🏆 피드백 보기" />
          </>
        )}
      </nav>
    );
  }

  if (segments.includes("mypage")) {
    return (
      <nav className="text-gray-500 text-sm mb-2">
        {/* 🔹 나의 그룹들 (홈) */}
        <BreadcrumbLink href="/mypage" label="🚀 나의 페이지" />
      </nav>
    );
  }

  if (segments.includes("solved-problems")) {
    return (
      <nav className="text-gray-500 text-sm mb-2">
        {/* 🔹 나의 그룹들 (홈) */}
        <BreadcrumbLink href="/solved-problems" label="🔥 내가 푼 문제 모음" />
      </nav>
    );
  }

  if (segments.includes("registered-problems")) {
    return (
      <nav className="text-gray-500 text-sm mb-2">
        {/* 📌 내가 등록한 문제들 */}
        <BreadcrumbLink href="/registered-problems" label="📌 내가 등록한 문제들" />

        {/* 📝 문제 등록하기 (/registered-problems/create) */}
        {segments.length >= 2 && segments[1] === "create" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbLink href="/registered-problems/create" label="📝 문제 등록하기" />
          </>
        )}

        {/* 🛠 문제 수정하기 (/registered-problems/edit/{id}) */}
        {segments.length >= 3 && segments[1] === "edit" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbLink
              href={`/registered-problems/edit/${segments[2]}`}
              label="🛠 문제 수정하기"
            />
          </>
        )}
      </nav>
    );
  }
}

/* 🔹 Breadcrumb 링크 컴포넌트 */
function BreadcrumbLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="hover:underline">
      {label}
    </Link>
  );
}

/* 🔹 Breadcrumb 구분자 ( > ) */
function BreadcrumbSeparator() {
  return <span> {" > "} </span>;
}
