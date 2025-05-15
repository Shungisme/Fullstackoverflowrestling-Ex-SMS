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
import { useLanguage } from "@/src/context/LanguageContext";
import { Button } from "@/src/components/atoms/Button";

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

  const { t } = useLanguage();

  return (
    <div className="overflow-x-auto">
      {results.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">{t("notiNodata")}</p>
        </div>
      ) : (
        <Table className="min-w-full bg-background border border-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 border">
                {t("StudentResults_Table_Student")}
              </TableHead>
              <TableHead className="px-4 py-2 border">
                {t("StudentResults_Table_Class")}
              </TableHead>
              <TableHead className="px-4 py-2 border">
                {t("StudentResults_Table_GradeType")}
              </TableHead>
              <TableHead className="px-4 py-2 border">
                {t("StudentResults_Table_GradeFactor")}
              </TableHead>
              <TableHead className="px-4 py-2 border">
                {t("StudentResults_Table_Grade")}
              </TableHead>
              <TableHead className="px-4 py-2 border">
                {t("StudentResults_Table_Actions")}
              </TableHead>
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
                      <Button onClick={() => handleEditClick(result)}>
                        {t("StudentResults_Table_EditCellBtn")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-bold">
                  <TableCell className="px-4 py-2 border" colSpan={5}>
                    {t("StudentResults_Table_FinalCell_FinalGrade")}
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
