import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface CodeLog {
  id: number;
  code: string;
  timestamp: string;
}

interface CodeLogReplayProps {
  codeLogs: CodeLog[];
  idx: number;
}

const CodeLogReplay = ({ codeLogs, idx }: CodeLogReplayProps) => {
  const [currentLogIndex, setCurrentLogIndex] = useState<number>(idx);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2);

  // 자동 재생 로직
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && codeLogs.length > 0) {
      interval = setInterval(() => {
        setCurrentLogIndex((prev) =>
          prev < codeLogs.length - 1 ? prev + 1 : prev
        );
      }, 500 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, codeLogs.length]);

  return (
    <div className="w-full h-[clamp(45vh, 55vh, 70vh)] p-4">
      <div className="p-4 shadow rounded-lg h-full">
        {/* 🔹 컨트롤 패널 (재생, 속도 설정, 재생 바) */}
        <div
          className="flex items-center gap-2
                      p-[clamp(4px, 1vw, 16px)] mb-4"
        >
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-32 h-8 px-4 py-2
             flex items-center justify-center
             bg-mygreen text-white rounded 
             hover:bg-gray-800 
             transition-all duration-200 ease-in-out active:scale-95"
          >
            {isPlaying ? "일시정지" : "재생"}
          </button>

          {/* 🔹 재생 속도 설정 */}
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="px-4 py-1 border rounded w-[clamp(60px, 8vw, 120px)] 
                     focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value={1}>0.5x</option>
            <option value={2}>1x</option>
            <option value={4}>2x</option>
            <option value={8}>4x</option>
          </select>

          {/* 🔹 재생 바 (반응형 크기 조정) */}
          <input
            type="range"
            min={0}
            max={codeLogs.length - 1}
            value={currentLogIndex}
            onChange={(e) => {
              setCurrentLogIndex(Number(e.target.value));
              setIsPlaying(false);
            }}
            style={{
              background: `linear-gradient(to right, #589960 ${
                (currentLogIndex / (codeLogs.length - 1)) * 100
              }%, #D3D3D3 ${(currentLogIndex / (codeLogs.length - 1)) * 100}%)`,
            }}
            className="flex-1 h-[clamp(4px, 1vw, 8px)]
             appearance-none rounded-lg overflow-hidden 
             [&::-webkit-slider-runnable-track]:bg-transparent
             [&::-webkit-slider-thumb]:appearance-none 
             [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
             [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
             [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
             [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full"
          />
        </div>

        {/* 🔹 코드 에디터 (적응형 높이 조정) */}
        <div className="h-[40vh] border border-gray-200 rounded overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={codeLogs[currentLogIndex]?.code}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 16,
              lineNumbers: "on",
              roundedSelection: false,
              contextmenu: false,
              automaticLayout: true,
              scrollbar: {
                vertical: "visible",
                horizontal: "visible",
              },
              padding: { top: 10, bottom: 10 },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeLogReplay;
