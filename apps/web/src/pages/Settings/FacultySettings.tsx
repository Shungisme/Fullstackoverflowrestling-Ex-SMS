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

export default function FacultySettings() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const fetchData = async () => {
    try {
      const res = await FacultyService.getAll();
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
      await FacultyService.delete(itemToDelete);
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
      const edited = await FacultyService.update(item.id, item);
      if (!edited) {
        toast.error("Gặp lỗi khi cập nhật khoa!");
        return;
      }
      setFaculties(faculties.map((f) => (f.id === edited.data.id ? edited.data : f)));
      toast.info("Thông tin khoa đã được cập nhật thành công");
    } else {
      // Thêm mới
      const newFaculty: IAPIResponse<Faculty> =
        await FacultyService.create(item);
      if (!newFaculty) {
        toast.error("Gặp lỗi khi thêm mới khoa!");
        return;
      }
      setFaculties([...faculties, newFaculty.data]);
      toast.info("Thông tin khoa mới đã được thêm thành công");
    }
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Danh sách khoa</h3>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm khoa mới
        </Button>
      </div>

      <div className="border rounded-md">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 text-sm font-medium">Tên khoa</th>
              <th className="text-left p-3 text-sm font-medium">Mô tả Khoa</th>
              <th className="text-left p-3 text-sm font-medium">
                Trạng thái khoa
              </th>
              <th className="text-right p-3 text-sm font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty.id} className="border-t">
                <td className="p-3">{faculty.title}</td>
                <td className="p-3">{faculty.description}</td>
                <td className="p-3">{faculty.status}</td>
                <td className="p-3 text-right">
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
        title="Xóa khoa"
        description="Bạn có chắc chắn muốn xóa khoa này? Hành động này không thể hoàn tác."
        variant="destructive"
      />

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        item={currentItem}
        title={currentItem ? "Chỉnh sửa thông tin khoa" : "Thêm khoa mới"}
        fields={[
          { name: "title", label: "Tên khoa", type: "text" },
          { name: "description", label: "Mô tả Khoa", type: "text" },
        ]}
      />
    </div>
  );
}
