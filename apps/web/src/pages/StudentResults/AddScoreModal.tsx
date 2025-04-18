import React, { useState, useEffect } from "react";
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
import { getStudents } from "@/src/lib/api/student-service";
import { ClassService } from "@/src/lib/api/school-service";
import { toast } from "sonner";
import LoadingSpinner from "@/src/components/LoadingSpinner";

interface AddScoreModalProps {
    onClose: () => void;
    onSave: (newScore: Omit<ClassResult, "id">) => Promise<void>;
    studentIdParam?: string;
    classCodeParam?: string;
}

const AddScoreModal: React.FC<AddScoreModalProps> = ({
    onClose,
    onSave,
    studentIdParam,
    classCodeParam,
}) => {
    const [scoreData, setScoreData] = useState<ClassResult>({
        studentId: studentIdParam || "",
        classCode: classCodeParam || "",
        score: 0,
        factor: 0.5,
        type: "MIDTERM",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [students, setStudents] = useState<
        Array<{ id: string; studentId: string; name: string }>
    >([]);
    const [classes, setClasses] = useState<
        Array<{ code: string; title: string }>
    >([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Load students list (first page with many items)
                const studentsResponse = await getStudents(1, 100);
                if (studentsResponse.statusCode === 200) {
                    setStudents(
                        studentsResponse.data.students.map((student) => ({
                            id: student.id || "",
                            studentId: student.studentId,
                            name: student.name,
                        })),
                    );
                }

                // Load classes list
                const classService = new ClassService();
                const classesResponse = await classService.getAll();
                if (classesResponse.statusCode === 200) {
                    setClasses(
                        classesResponse.data.data.map((cls) => ({
                            code: cls.code,
                            title: cls.classroom,
                        })),
                    );
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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
        if (!scoreData.studentId) {
            toast.error("Vui lòng chọn sinh viên");
            setIsSubmitting(false);
            return;
        }

        if (!scoreData.classCode) {
            toast.error("Vui lòng chọn lớp học");
            setIsSubmitting(false);
            return;
        }

        if (scoreData.score < 0 || scoreData.score > 10) {
            toast.error("Điểm phải từ 0 đến 10");
            setIsSubmitting(false);
            return;
        }

        if (scoreData.factor <= 0 || scoreData.factor > 1) {
            toast.error("Hệ số phải từ 0 đến 1");
            setIsSubmitting(false);
            return;
        }

        try {
            await onSave(scoreData);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Thêm điểm mới</h2>

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                Sinh viên <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                name="studentId"
                                value={scoreData.studentId}
                                onValueChange={(value) =>
                                    setScoreData({ ...scoreData, studentId: value })
                                }
                                required
                                disabled={!!studentIdParam}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn sinh viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.studentId}>
                                            {student.studentId} - {student.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-4">
                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                Lớp học <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                name="classCode"
                                value={scoreData.classCode}
                                onValueChange={(value) =>
                                    setScoreData({ ...scoreData, classCode: value })
                                }
                                required
                                disabled={!!classCodeParam}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn lớp học" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.code} value={cls.code}>
                                            {cls.code} - {cls.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-4">
                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại điểm <span className="text-destructive">*</span>
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
                                Hệ số (0-1) <span className="text-destructive">*</span>
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
                                Điểm (0-10) <span className="text-destructive">*</span>
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
                                Hủy
                            </Button>
                            <Button type="submit" variant="default" disabled={isSubmitting}>
                                {isSubmitting ? "Đang lưu..." : "Thêm điểm"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddScoreModal;
