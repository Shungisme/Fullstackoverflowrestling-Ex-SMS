import React, { useState } from "react";
import { ClassResult } from "@/src/types/course";
import { Input, Label } from "@repo/ui";
import { Button } from "@/src/components/atoms/Button";
import { mapScoreTypeToLabel } from "@/src/utils/mapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/Select";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { useLanguage } from "@/src/context/LanguageContext";

interface EditScoreModalProps {
  result: ClassResult;
  onClose: () => void;
  onSave: (updatedScore: ClassResult) => Promise<void>;
}

const EditScoreModal: React.FC<EditScoreModalProps> = ({
  result,
  onClose,
  onSave,
}) => {
  if (!result) {
    return <LoadingSpinner />; // or some fallback UI
  }
  const [scoreData, setScoreData] = useState<{
    score: number;
    factor: number;
    type: ClassResult["type"];
  }>({
    score: result.score,
    factor: result.factor,
    type: result.type,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Convert number fields to actual numbers
    if (name === "score" || name === "factor") {
      setScoreData({
        ...scoreData,
        [name]: parseFloat(value),
      });
    } else {
      setScoreData({
        ...scoreData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate the data
    if (scoreData.score < 0 || scoreData.score > 10) {
      alert("Score must be between 0 and 10");
      setIsSubmitting(false);
      return;
    }

    if (scoreData.factor <= 0 || scoreData.factor > 1) {
      alert("Factor must be between 0 and 1");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create updated score object
      const updatedScore = {
        ...result,
        ...scoreData,
      };

      await onSave(updatedScore);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {t("StudentResults_EditModal_Title")}
        </h2>

        <div className="mb-4">
          <p>
            <span className="font-semibold">
              {t("StudentResults_Table_Student")}:
            </span>{" "}
            {result.student?.name} ({result.student?.studentId})
          </p>
          <p>
            <span className="font-semibold">
              {t("StudentResults_Table_Class")}:
            </span>{" "}
            {result.class?.code}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              {t("StudentResults_Table_GradeType")}
            </Label>
            <Select
              name="type"
              value={scoreData.type}
              onValueChange={(value: ClassResult["type"]) =>
                setScoreData({ ...scoreData, type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={mapScoreTypeToLabel(scoreData.type)}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MIDTERM">
                  {mapScoreTypeToLabel("MIDTERM")}
                </SelectItem>
                <SelectItem value="FINALTERM">
                  {mapScoreTypeToLabel("FINALTERM")}
                </SelectItem>
                <SelectItem value="OTHER">
                  {mapScoreTypeToLabel("OTHER")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label
              htmlFor="factor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("StudentResults_Table_GradeFactor")} (0-1)
            </Label>
            <Input
              type="number"
              name="factor"
              value={scoreData.factor}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <Label
              htmlFor="score"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("StudentResults_Table_Grade")} (0-10)
            </Label>
            <Input
              type="number"
              name="score"
              value={scoreData.score}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="secondary"
            >
              {t("cancelBtn")}
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? t("saving") : t("saveBtn")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScoreModal;
