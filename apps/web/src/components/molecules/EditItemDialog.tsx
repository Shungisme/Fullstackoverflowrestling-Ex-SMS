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
      fields.forEach(field => {
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
              <div key={field.name} className="grid grid-cols-4 items-center gap-4">
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
