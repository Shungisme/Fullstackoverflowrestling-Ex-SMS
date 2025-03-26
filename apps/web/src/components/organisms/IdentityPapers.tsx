import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../atoms/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../atoms/Dialog";
import { Button } from "../atoms/Button";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  Pencil,
  Plus,
  AlertCircle,
} from "lucide-react";
import { IdentityPapers } from "@/src/types";
import { Skeleton } from "../atoms/Skeleton";
import { Badge } from "../atoms/Badge";
import { format } from "date-fns";
import IdentityPaperForm from "../molecules/IdentityPaperForm";
import { toast } from "sonner";
import { BASE_URL } from "@/src/constants/constants";

interface IdentityPapersTabProps {
  id: string; // Student ID
}

const IdentityPapersTab = ({ id }: IdentityPapersTabProps) => {
  const [paper, setPaper] = useState<IdentityPapers | null>(null);
  const [isAddingPaper, setIsAddingPaper] = useState(false);
  const [isEditingPaper, setIsEditingPaper] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/identity-papers/${id}`);
        
        if (!response.ok) {
          // If 404, it might mean the student doesn't have a paper yet
          if (response.status === 404) {
            setPaper(null);
          } else {
            throw new Error(`Failed to fetch identity paper: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setPaper(data.data);
        }
      } catch (err) {
        console.error("Error fetching identity paper:", err);
        setError("Failed to load identity document");
        toast.error("Failed to load identity document");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPaper();
    }
  }, [id]);

  const handleAddPaper = async (paperData: IdentityPapers) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${BASE_URL}/students/${id}/identity-paper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paperData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add identity paper');
      }
      
      const data = await response.json();
      setPaper(data.data);
      setIsAddingPaper(false);
      toast.success("Identity document added successfully");
    } catch (err) {
      console.error("Error adding identity paper:", err);
      toast.error("Failed to add identity document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaper = async (paperData: IdentityPapers) => {
    if (!paper?.id) return;
    
    try {
      setIsLoading(true); 
      delete paperData.updatedAt;
      delete paperData.createdAt;
      const response = await fetch(`${BASE_URL}/identity-papers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paperData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update identity paper');
      }
      
      const data = await response.json();
      setPaper(data.data);
      setIsEditingPaper(false);
      toast.success("Identity document updated successfully");
    } catch (err) {
      console.error("Error updating identity paper:", err);
      toast.error("Failed to update identity document");
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "passport":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "id card":
      case "national id":
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case "driver license":
        return <CreditCard className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const isExpired = (date: Date | string) => {
    return new Date(date) < new Date();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Identity Paper</CardTitle>
          <CardDescription>
            Student's official identification document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Giấy tờ định danh</CardTitle>
          <CardDescription>
            Giấy tờ tùy thân chính thức của sinh viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ErrorNotifier(error)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Giấy tờ định danh</CardTitle>
          <CardDescription>
            Giấy tờ tùy thân chính thức của sinh viên
          </CardDescription>
        </div>
        {/* Only show Add button if no paper exists */}
      </CardHeader>
      <CardContent className="space-y-4">
        {!paper ? (
          <div className="bg-muted p-6 rounded-md text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-medium mb-1">No document found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This student doesn't have an identity document registered yet.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                {getDocumentIcon(paper.type)}
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {paper.type}
                    {isExpired(paper.expirationDate) && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] py-0"
                      >
                        Expired
                      </Badge>
                    )}
                    {paper.hasChip && (
                      <Badge variant="outline" className="text-[10px] py-0">
                        Chip
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {paper.number}
                  </p>
                </div>
              </div>
              
              {/* Edit button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsEditingPaper(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Identity Document</DialogTitle>
                    <DialogDescription>
                      Update the details of this identity document.
                    </DialogDescription>
                  </DialogHeader>
                  <IdentityPaperForm 
                    initial={paper}
                    onSubmit={handleUpdatePaper}
                    onCancel={() => setIsEditingPaper(false)}
                    isSubmitting={isLoading}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">
                  Issue Date
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {format(new Date(paper.issueDate), "dd/MM/yyyy")}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-xs">
                  Expiration Date
                </span>
                <span
                  className={`flex items-center gap-1 ${isExpired(paper.expirationDate) ? "text-destructive" : ""}`}
                >
                  <Calendar
                    className={`h-3.5 w-3.5 ${isExpired(paper.expirationDate) ? "text-destructive" : "text-muted-foreground"}`}
                  />
                  {format(new Date(paper.expirationDate), "dd/MM/yyyy")}
                  {isExpired(paper.expirationDate) && (
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  )}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-muted-foreground block text-xs">
                  Place of Issue
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {paper.placeOfIssue}
                  {paper.issuingCountry && `, ${paper.issuingCountry}`}
                </span>
              </div>

              {paper.note && (
                <div className="col-span-2 mt-1">
                  <span className="text-muted-foreground block text-xs">
                    Notes
                  </span>
                  <p className="text-sm italic">{paper.note}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IdentityPapersTab;
function ErrorNotifier(error: string) {
    return <div className="bg-destructive/10 p-6 rounded-md text-center">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
        <h3 className="text-sm font-medium mb-1">Lỗi khi tải thông tin sinh viên</h3>
        <p className="text-sm text-muted-foreground mb-4">
            {error}
        </p>
        <Button
            variant="outline"
            onClick={() => window.location.reload()}
        >
            Thử lại
        </Button>
    </div>;
}
