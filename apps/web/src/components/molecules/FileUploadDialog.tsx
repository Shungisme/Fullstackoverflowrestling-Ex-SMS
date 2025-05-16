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
import LoadingSpinner from "../LoadingSpinner";
import { useLanguage } from "@/src/context/LanguageContext";

interface FileUploadDialogProps {
  onUpload: (file: File) => Promise<boolean>;
}

export default function FileUploadDialog({ onUpload }: FileUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleUpload = async () => {
    if (file) {
      // Handle file upload logic here
      setIsLoading(true);
      const success = await onUpload(file);
      setIsLoading(false);
      if (success) {
        setFile(null);
      }
    }
  };
  const { t } = useLanguage();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-5 w-5" /> {t("importButton")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("FileUploadDialog_DialogHeader")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="file">{t("FileUploadDialog_InputLabel")}</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept={allowedTypes.join(",")}
          />
          {file && (
            <p className="text-sm text-gray-500">{t("FileUploadDialog_SelectedFileName")}: {file.name}</p>
          )}
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="mt-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
