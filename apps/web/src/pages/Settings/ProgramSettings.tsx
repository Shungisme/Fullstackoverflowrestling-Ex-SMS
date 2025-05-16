"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/atoms/Button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/src/hooks/useConfirmDialog";
import ConfirmDialog from "@/src/components/molecules/ConfirmDialog";
import EditItemDialog from "@/src/components/molecules/EditItemDialog";
import { toast } from "sonner";
import { Program } from "@/src/types";
import { ProgramService } from "@/src/lib/api/school-service";
import { useLanguage } from "@/src/context/LanguageContext";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/src/components/molecules/DataTable";

export default function ProgramSettings() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const { language } = useLanguage();
  const service = new ProgramService(language);

  const fetchData = async () => {
    try {
      const res = await service.getAll([]);
      if (res.statusCode !== 200) {
        toast.error(res.message);
      } else {
        setPrograms(res.data.data);
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
  const [currentItem, setCurrentItem] = useState<Program | null>(null);

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (program: Program) => {
    setCurrentItem(program);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    setItemToDelete(id);
    openConfirm(id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const deleted = await service.delete(itemToDelete);
      if (deleted.statusCode !== 200) {
        toast.error(deleted.message);
        return;
      }
      fetchData();
      toast.info("Đã xóa chương trình học");
    }
  };

  const handleSave = async (item: Program) => {
    if (currentItem) {
      if (!item.id) {
        toast.error("Có lỗi khi sửa chương trình học!");
        return;
      }
      delete item.updatedAt;
      delete item.createdAt;
      const edited = await service.update(item.id, item);
      toast.info("Thông tin chương trình học đã được cập nhật thành công");
    } else {
      // Thêm mới
      const newItem = await service.create(item);
      toast.info("Thông tin chương trình học mới đã được thêm thành công");
    }
    fetchData();
    setIsEditDialogOpen(false);
  };

  const { t } = useLanguage();

  const columns: ColumnDef<Program>[] = [
    {
      accessorKey: "title",
      header: t("ProgramSettings_Table_Header_Title"),
    },
    {
      accessorKey: "description",
      header: t("ProgramSettings_Table_Header_Desc"),
    },
    {
      accessorKey: "status",
      header: t("ProgramSettings_Table_Header_Status"),
    },
    {
      accessorKey: "actions",
      header: t("ProgramSettings_Table_Header_Actions"),
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("ProgramSettings_Title")}</h3>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> {t("ProgramSettings_AddProgramBtn")}
        </Button>
      </div>

      <div className="border rounded-md">
        <DataTable columns={columns} data={programs} />
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        title={t("ProgramSettings_ConfirmDelete_Title")}
        description={t("ProgramSettings_ConfirmDelete_Desc")}
        variant="destructive"
      />

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        item={currentItem}
        title={
          currentItem
            ? t("ProgramSettings_EditItem_Title")
            : t("ProgramSettings_AddItem_Title")
        }
        fields={[
          {
            name: "title",
            label: t("ProgramSettings_EditItem_Label_Title"),
            type: "text",
          },
          {
            name: "description",
            label: t("ProgramSettings_EditItem_Label_Desc"),
            type: "text",
          },
        ]}
      />
    </div>
  );
}
