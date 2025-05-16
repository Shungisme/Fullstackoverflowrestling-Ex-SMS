"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/atoms/Button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/src/hooks/useConfirmDialog";
import ConfirmDialog from "@/src/components/molecules/ConfirmDialog";
import EditItemDialog from "@/src/components/molecules/EditItemDialog";
import { toast } from "sonner";
import { Faculty, IAPIResponse } from "@/src/types";
import { FacultyService } from "@/src/lib/api/school-service";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/atoms/Table";

export default function FacultySettings() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const { language } = useLanguage();
  const service = new FacultyService(language);

  const fetchData = async () => {
    try {
      const res = await service.getAll([]);
      if (res.statusCode !== 200) {
        toast.error(res.message);
      } else {
        setFaculties(res.data.data);
      }
    } catch {
      toast.error("Can't fetch data'");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    isOpen: isConfirmOpen,
    openConfirmDialog: openConfirm,
    closeConfirmDialog: closeConfirm,
  } = useConfirmDialog();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Faculty | null>(null);

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (faculty: Faculty) => {
    setCurrentItem(faculty);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    setItemToDelete(id);
    openConfirm(id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await service.delete(itemToDelete);
      setFaculties(faculties.filter((f) => f.id !== itemToDelete));
      toast.info("Đã xóa khoa");
    }
  };

  const handleSave = async (item: Faculty) => {
    if (currentItem) {
      // Cập nhật
      if (!item.id) {
        toast.error("Gặp lỗi khi cập nhật khoa!");
        return;
      }
      delete item.createdAt;
      delete item.updatedAt;
      const edited = await service.update(item.id, item);
      if (!edited) {
        toast.error("Gặp lỗi khi cập nhật khoa!");
        return;
      }
      setFaculties(
        faculties.map((f) => (f.id === edited.data.id ? edited.data : f)),
      );
      toast.info("Thông tin khoa đã được cập nhật thành công");
    } else {
      // Thêm mới
      const newFaculty: IAPIResponse<Faculty> =
        await service.create(item);
      if (!newFaculty) {
        toast.error("Gặp lỗi khi thêm mới khoa!");
        return;
      }
      setFaculties([...faculties, newFaculty.data]);
      toast.info("Thông tin khoa mới đã được thêm thành công");
    }
    setIsEditDialogOpen(false);
  };

  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("FacultySettings_Title")}</h3>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> {t("FacultySettings_AddFacultyBtn")}
        </Button>
      </div>

      <div className="border rounded-md">
        <Table className="w-full">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-left p-3 text-sm font-medium">
                {t("FacultySettings_Table_Header_Title")}
              </TableHead>
              <TableHead className="text-left p-3 text-sm font-medium">
                {t("FacultySettings_Table_Header_Desc")}
              </TableHead>
              <TableHead className="text-left p-3 text-sm font-medium">
                {t("FacultySettings_Table_Header_Status")}
              </TableHead>
              <th className="text-right p-3 text-sm font-medium">
                {t("FacultySettings_Table_Header_Status")}
              </th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculties.map((faculty) => (
              <TableRow key={faculty.id} className="border-t">
                <TableCell className="p-3">{faculty.title}</TableCell>
                <TableCell className="p-3">{faculty.description}</TableCell>
                <TableCell className="p-3">{faculty.status}</TableCell>
                <TableCell className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(faculty)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(faculty.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        title={t("FacultySettings_ConfirmDelete_Title")}
        description={t("FacultySettings_ConfirmDelete_Desc")}
        variant="destructive"
      />

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        item={currentItem}
        title={
          currentItem
            ? t("FacultySettings_EditItem_Title")
            : t("FacultySettings_AddItem_Title")
        }
        fields={[
          {
            name: "title",
            label: t("FacultySettings_EditItem_Label_Title"),
            type: "text",
          },
          {
            name: "description",
            label: t("FacultySettings_EditItem_Label_Desc"),
            type: "text",
          },
        ]}
      />
    </div>
  );
}
