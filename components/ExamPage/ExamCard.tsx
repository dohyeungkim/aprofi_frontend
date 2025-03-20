"use client";

interface ExamCardProps {
  workbook: {
    workbook_id: number;
    group_id: number;
    workbook_name: string;
    problem_cnt: number;
    description: string;
    creation_date: string;
  };
  exam?: {
    examId: string;
    startTime: string;
    endTime: string;
  } | null;
  onClick: () => void;
}

// ✅ 생성일을 'YY.MM.DD' 형식으로 변환하는 함수
// const formatShortDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const year = date.getFullYear().toString().slice(2); // YY (두 자리 연도)
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // MM (두 자리 월)
//   const day = String(date.getDate()).padStart(2, "0"); // DD (두 자리 날짜)
//   return `${year}.${month}.${day}`;
// };

export default function ExamCard({ workbook, onClick }: ExamCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer 
                shadow-md transition-all duration-300 ease-in-out 
                hover:-translate-y-1 hover:shadow-xl transform-gpu 
                flex flex-col justify-between h-full"
    >
      {/* ✅ 제목 (workbook_name) - 상단 고정 */}
      <div>
        <h2 className="text-xl font-semibold mb-2 overflow-hidden text-ellipsis">
          📄{" "}
          {workbook.workbook_name.length > 24
            ? `${workbook.workbook_name.slice(0, 24)}...`
            : workbook.workbook_name}
        </h2>
      </div>

      {/* ✅ 설명 및 정보 - 하단 정렬 */}
      <div>
        <p
          title={workbook.description}
          className="mb-1 w-full text-gray-600 text-sm overflow-hidden text-ellipsis line-clamp-2"
        >
          {workbook.description}
        </p>
        <p className="mb-2  ">📌 문제 수: {workbook.problem_cnt}개</p>
        {/* <p className="mb-1">📅 생성일: {formatShortDate(workbook.creation_date)}</p> */}
      </div>

      {/* ✅ 버튼 - 항상 아래에 위치 */}
      <button className="w-full py-2 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out active:scale-95 bg-mygreen text-white hover:bg-opacity-80">
        문제지 펼치기 →
      </button>
    </div>
  );
}
