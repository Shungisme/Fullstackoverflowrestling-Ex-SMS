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

export default function StudentStatusSettings() {
  const [statuses, setStatuses] = useState<StudentStatus[]>([]);

  const fetchData = async () => {
    try {
      const res = await StudentStatusService.getAll([]);
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
      await StudentStatusService.delete(itemToDelete);
      setStatuses(statuses.filter((f) => f.id !== itemToDelete));
      toast.info("Đã xóa sinh viên");
    }
  };

  const handleSave = async (item: StudentStatus) => {
    if (currentItem) {
      if (!item.id) return;
      delete item.createdAt;
      delete item.updatedAt;
      const edited = await StudentStatusService.update(item.id, item);
      setStatuses(statuses.map((f) => (f.id === edited.data.id ? edited.data : f)));
      toast.info("Thông tin sinh viên đã được cập nhật thành công");
    } else {
      // Thêm mới
      const newItem = await StudentStatusService.create(item);
      setStatuses([...statuses, newItem.data]);
      toast.info("Thông tin sinh viên mới đã được thêm thành công");
    }
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Danh sách sinh viên</h3>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm tình trạng sinh viên mới
        </Button>
      </div>

      <div className="border rounded-md">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 text-sm font-medium">
                Tên trạng thái
              </th>
              <th className="text-left p-3 text-sm font-medium">
                Mô tả trạng thái
              </th>
              <th className="text-left p-3 text-sm font-medium">Trạng thái</th>
              <th className="text-right p-3 text-sm font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr key={status.id} className="border-t">
                <td className="p-3">{status.title}</td>
                <td className="p-3">{status.description}</td>
                <td className="p-3">{status.status}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(status)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(status.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        title="Xóa sinh viên"
        description="Bạn có chắc chắn muốn xóa sinh viên này? Hành động này không thể hoàn tác."
        variant="destructive"
      />

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        item={currentItem}
        title={
          currentItem ? "Chỉnh sửa thông tin trạng thái" : "Thêm trạng thái mới"
        }
        fields={[
          { name: "title", label: "Tên trạng thái", type: "text" },
          { name: "description", label: "Mô tả trạng thái", type: "text" },
        ]}
      />
    </div>
  );
}
