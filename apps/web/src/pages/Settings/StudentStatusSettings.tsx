"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/atoms/Button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/src/hooks/useConfirmDialog";
import ConfirmDialog from "@/src/components/molecules/ConfirmDialog";
import EditItemDialog from "@/src/components/molecules/EditItemDialog";
import { toast } from "sonner";
import { StudentStatus } from "@/src/types";
import { StudentStatusService } from "@/src/lib/api/school-service";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/atoms/Table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/src/components/molecules/DataTable";

export default function StudentStatusSettings() {
  const [statuses, setStatuses] = useState<StudentStatus[]>([]);
  const { language } = useLanguage();
  const service = new StudentStatusService(language);

  const fetchData = async () => {
    try {
      const res = await service.getAll([]);
      if (res.statusCode !== 200) {
        toast.error(res.message);
      } else {
        setStatuses(res.data.data);
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
  const [currentItem, setCurrentItem] = useState<StudentStatus | null>(null);

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (status: StudentStatus) => {
    setCurrentItem(status);
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
      setStatuses(statuses.filter((f) => f.id !== itemToDelete));
      toast.info("Đã xóa sinh viên");
    }
  };

  const handleSave = async (item: StudentStatus) => {
    if (currentItem) {
      if (!item.id) return;
      delete item.createdAt;
      delete item.updatedAt;
      const edited = await service.update(item.id, item);
      setStatuses(
        statuses.map((f) => (f.id === edited.data.id ? edited.data : f)),
      );
      toast.info("Thông tin sinh viên đã được cập nhật thành công");
    } else {
      // Thêm mới
      const newItem = await service.create(item);
      setStatuses([...statuses, newItem.data]);
      toast.info("Thông tin sinh viên mới đã được thêm thành công");
    }
    setIsEditDialogOpen(false);
  };

  const { t } = useLanguage();

  const columns: ColumnDef<StudentStatus>[] = [
    {
      accessorKey: "title",
      header: t("StudentStatusSettings_Table_Header_Title"),
    },
    {
      accessorKey: "description",
      header: t("StudentStatusSettings_Table_Header_Desc"),
    },
    {
      accessorKey: "status",
      header: t("StudentStatusSettings_Table_Header_Status"),
    },
    {
      accessorKey: "actions",
      header: t("StudentStatusSettings_Table_Header_Actions"),
      cell: ({ row }) => (
        <div>
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
        <h3 className="text-lg font-medium">
          {t("StudentStatusSettings_Title")}
        </h3>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> {t("StudentStatusSettings_AddStatusBtn")}
        </Button>
      </div>

      <div className="border rounded-md">
        <DataTable columns={columns} data={statuses} />
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        title={t("StudentStatusSettings_ConfirmDelete_Title")}
        description={t("StudentStatusSettings_ConfirmDelete_Desc")}
        variant="destructive"
      />

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        item={currentItem}
        title={
          currentItem
            ? t("StudentStatusSettings_EditItem_Title")
            : t("StudentStatusSettings_AddItem_Title")
        }
        fields={[
          {
            name: "title",
            label: t("StudentStatusSettings_EditItem_Label_Title"),
            type: "text",
          },
          {
            name: "description",
            label: t("StudentStatusSettings_EditItem_Label_Desc"),
            type: "text",
          },
        ]}
      />
    </div>
  );
}
