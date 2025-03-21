import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../atoms/Dialog";
import { Button } from "../atoms/Button";
import { Input, Label } from "@repo/ui";
import { Upload } from "lucide-react";

interface FileUploadDialogProps {
    onUpload: (file: File) => void;
}

export default function FileUploadDialog({ onUpload }: FileUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const allowedTypes = [
        "application/json",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
            } else {
                alert("Only .json and excel files are allowed.");
                setFile(null);
            }
        }
    };

    const handleUpload = () => {
        if (file) {
            // Handle file upload logic here
            onUpload(file);
            setFile(null);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-5 w-5" /> Nhập dữ liệu
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đăng tải 1 file</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="file">Chọn file tải lên</Label>
                    <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        accept={allowedTypes.join(",")}
                    />
                    {file && (
                        <p className="text-sm text-gray-500">Selected file: {file.name}</p>
                    )}
                    <Button onClick={handleUpload} disabled={!file} className="mt-2">
                        Upload
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
