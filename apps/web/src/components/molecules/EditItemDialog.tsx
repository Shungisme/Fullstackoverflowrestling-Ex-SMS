import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/atoms/Dialog";
import { Button } from "../../components/atoms/Button";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../atoms/Select";

interface Field {
  name: string;
  label: string;
  type: string;
}

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  item: any | null;
  title: string;
  fields: Field[];
}

export default function EditItemDialog({
  isOpen,
  onClose,
  onSave,
  item,
  title,
  fields,
}: EditItemDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      const initialData: Record<string, string> = {};
      fields.forEach((field) => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
    }
  }, [item, fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleValueChange = (type: string, value: string) => {
      setFormData({
          ...formData,
          [type]: value,
      })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div
                key={field.name}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label htmlFor={field.name} className="text-right">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            ))}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng thái
              </Label>
              <Select name="status" value={formData["status"]} onValueChange={(value) => handleValueChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue
                   placeholder="Chọn trạng thái"
                    defaultValue="active"
                  />
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
