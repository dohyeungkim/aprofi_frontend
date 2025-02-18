"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "@/components/Header/SearchBar";
import ViewToggle from "@/components/Header/ViewToggle";
import SortButton from "@/components/Header/SortButton";
import { motion } from "framer-motion";

// ✅ Question 인터페이스 정의
interface Question {
  id: number;
  title: string;
  group: string;
  paper: string;
  solvedCount: number;
}

export default function MyRegisteredProblemView() {
  const router = useRouter();

  // 🔹 검색어 상태
  const [search, setSearch] = useState("");
  // 🔹 API에서 가져온 문제 목록 상태
  const [questions, setQuestions] = useState<Question[]>([]);
  const [viewMode, setViewMode] = useState<"gallery" | "table">("gallery");

  // 🔹 검색어에 따라 필터링
  const filteredData: Question[] = questions.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 문제 등록 페이지로 이동
  const handleNavigate = () => {
    router.push("registered-problems/create");
  };

  return (
    <motion.div>
      {/* 생성하기 버튼 */}
      <motion.div
        className="flex items-center gap-2 justify-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}>
        {" "}
        <button
          onClick={handleNavigate}
          className="flex items-center bg-black text-white px-4 py-1.5 rounded-xl m-2 text-md cursor-pointer
          hover:bg-gray-500 transition-all duration-200 ease-in-out
          active:scale-95">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          문제 만들기
        </button>
      </motion.div>

      {/* 버튼 영역 */}
      <motion.div
        className="flex items-center gap-4 mb-4 w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}>
        {" "}
        <div className="flex-grow min-w-0">
          <SearchBar searchQuery={search} setSearchQuery={setSearch} />
        </div>
        {/* 보기 방식 & 정렬 버튼 */}
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <SortButton onSortChange={() => {}} />
      </motion.div>

      {/* 문제 목록 */}
      <motion.h2
        className="text-2xl font-bold mb-4 m-2 pt-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}>
        나의 문제
      </motion.h2>
      <motion.hr
        className="border-b-1 border-gray-300 my-4 m-2"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />

      {/* 🔹 갤러리 뷰 */}
      {viewMode === "gallery" ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200"
                whileHover={{ scale: 1.02 }}>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.group}</p>
                <p className="text-gray-400 text-sm">{item.paper}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => router.push(`/registered-problems/view/${item.id}`)}
                    className="text-blue-500 hover:underline">
                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                    보기
                  </button>
                  <button className="text-red-500 hover:underline">
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    삭제
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">등록된 문제가 없습니다.</p>
          )}
        </motion.div>
      ) : (
        // 🔹 테이블 뷰
        <table className="w-full border-collapse bg-white shadow-md rounded-2xl overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">문제 제목</th>
              <th className="p-3 text-left">그룹명</th>
              <th className="p-3 text-left">문제지</th>
              <th className="p-3 text-left">푼 사람 수</th>
              <th className="p-3 text-left">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.group}</td>
                  <td className="p-3">{item.paper}</td>
                  <td className="p-3">{item.solvedCount}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => router.push(`/registered-problems/view/${item.id}`)}
                      className="text-blue-500 hover:underline mx-2">
                      보기
                    </button>
                    <button className="text-red-500 hover:underline">삭제</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 p-5">
                  등록된 문제가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}
