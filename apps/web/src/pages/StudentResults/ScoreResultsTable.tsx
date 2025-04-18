import React, { useState } from "react";
import { ClassResult } from "@/src/types/course";
import EditScoreModal from "./EditScoreModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/atoms/Table";
import { mapScoreTypeToLabel } from "@/src/utils/mapper";


interface ScoreResultsTableProps {
  results: ClassResult[];
  onScoreUpdate: (resultId: string, updatedScore: ClassResult) => Promise<void>;
}

const ScoreResultsTable: React.FC<ScoreResultsTableProps> = ({
  results,
  onScoreUpdate,
}) => {
  const [editingResult, setEditingResult] = useState<ClassResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEditClick = (result: ClassResult) => {
    setEditingResult(result);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingResult(null);
  };

  const handleSave = async (updatedScore: ClassResult) => {
    if (editingResult?.id) {
      await onScoreUpdate(editingResult.id, updatedScore);
    }
    handleModalClose();
  };

  if (!results) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không có kết quả</p>
      </div>
    );
  }
  // Group results by student and class
  const groupedResults = results.reduce(
    (acc, result) => {
      const key = `${result.student?.id || "unknown"}_${result.class?.code || "unknown"}`;
      if (!acc[key]) {
        acc[key] = {
          student: result.student,
          class: result.class,
          results: [],
        };
      }
      acc[key].results.push(result);
      return acc;
    },
    {} as Record<string, { student: any; class: any; results: ClassResult[] }>,
  );

  // Calculate final grades
  const calculateFinalGrade = (results: ClassResult[]): number => {
    if (!results.length) return 0;
    const totalScore = results.reduce(
      (sum, result) => sum + result.score * result.factor,
      0,
    );
    const totalFactor = results.reduce((sum, result) => sum + result.factor, 0);
    return totalFactor ? Number((totalScore / totalFactor).toFixed(2)) : 0;
  };

  return (
    <div className="overflow-x-auto">
      {results.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Không có kết quả</p>
        </div>
      ) : (
        <Table className="min-w-full bg-white border border-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 border">Sinh viên</TableHead>
              <TableHead className="px-4 py-2 border">Lớp</TableHead>
              <TableHead className="px-4 py-2 border">Loại điểm</TableHead>
              <TableHead className="px-4 py-2 border">Hệ số</TableHead>
              <TableHead className="px-4 py-2 border">Điểm</TableHead>
              <TableHead className="px-4 py-2 border">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(groupedResults).map((group) => (
              <React.Fragment key={`${group.student?.id}_${group.class?.code}`}>
                {group.results.map((result) => (
                  <TableRow key={result.id} className="hover:bg-gray-50">
                    <TableCell className="px-4 py-2 border">
                      {result.student?.studentId}
                      {result.student?.name && (
                        <span className="block text-sm text-gray-500">
                          {result.student.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2 border">
                      {result.class?.code}
                    </TableCell>
                    <TableCell className="px-4 py-2 border">
                      {mapScoreTypeToLabel(result.type)}
                    </TableCell>
                    <TableCell className="px-4 py-2 border">
                      {result.factor}
                    </TableCell>
                    <TableCell className="px-4 py-2 border">
                      {result.score}
                    </TableCell>
                    <TableCell className="px-4 py-2 border">
                      <button
                        onClick={() => handleEditClick(result)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                      >
                        Chỉnh sửa
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-bold">
                  <TableCell className="px-4 py-2 border" colSpan={5}>
                  Điểm tổng kết
                  </TableCell>
                  <TableCell className="px-4 py-2 border" colSpan={2}>
                    {calculateFinalGrade(group.results)}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}

      {isModalOpen && editingResult && (
        <EditScoreModal
          result={editingResult}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ScoreResultsTable;
