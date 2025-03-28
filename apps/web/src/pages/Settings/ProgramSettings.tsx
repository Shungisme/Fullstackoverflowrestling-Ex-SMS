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

export default function ProgramSettings() {
  const [faculties, setFaculties] = useState<Program[]>([]);

  const fetchData = async () => {
    try {
      const res = await ProgramService.getAll([]);
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
      const deleted = await ProgramService.delete(itemToDelete);
      if (deleted.statusCode !== 200) {
          toast.error(deleted.message);
          return;
      }
      setFaculties(faculties.filter((f) => f.id !== itemToDelete));
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
      const edited = await ProgramService.update(item.id, item);
      setFaculties(
        faculties.map((f) => (f.id === edited.data.id ? edited.data : f)),
      );
      toast.info("Thông tin chương trình học đã được cập nhật thành công");
    } else {
      // Thêm mới
      const newItem = await ProgramService.create(item);
      setFaculties([...faculties, newItem.data]);
      toast.info("Thông tin chương trình học mới đã được thêm thành công");
    }
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Danh sách chương trình học</h3>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm chương trình học mới
        </Button>
      </div>

      <div className="border rounded-md">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 text-sm font-medium">
                Tên chương trình học
              </th>
              <th className="text-left p-3 text-sm font-medium">Mô tả Khoa</th>
              <th className="text-left p-3 text-sm font-medium">
                Trạng thái chương trình học
              </th>
              <th className="text-right p-3 text-sm font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((program) => (
              <tr key={program.id} className="border-t">
                <td className="p-3">{program.title}</td>
                <td className="p-3">{program.description}</td>
                <td className="p-3">{program.status}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(program)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(program.id)}
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
        title="Xóa chương trình học"
        description="Bạn có chắc chắn muốn xóa chương trình học này? Hành động này không thể hoàn tác."
        variant="destructive"
      />

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        item={currentItem}
        title={
          currentItem
            ? "Chỉnh sửa thông tin chương trình học"
            : "Thêm chương trình học mới"
        }
        fields={[
          { name: "title", label: "Tên chương trình học", type: "text" },
          {
            name: "description",
            label: "Mô tả chương trình học",
            type: "text",
          },
        ]}
      />
    </div>
  );
}
