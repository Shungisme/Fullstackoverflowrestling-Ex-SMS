"use client";

import { useEffect, useState } from "react";
import {
  Address,
  AddressType,
  FormErrors,
  IAPIResponse,
  Student,
} from "@/src/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { BASE_URL } from "@/src/constants/constants";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/atoms/Dialog";
import { Button } from "@/src/components/atoms/Button";
import AddressForm from "@/src/components/molecules/AddressForm";
import IdentityPapersTab from "@/src/components/organisms/IdentityPapers";
import { AddressService } from "@/src/lib/api/address-service";
import AcademicTab from "@/src/pages/StudentDetail/Tabs/AcademicTab";
import ContactTab from "@/src/pages/StudentDetail/Tabs/ContactTab";
import LoadingPlaceholder from "@/src/pages/StudentDetail/LoadingPlaceholder";
import ErrorNotifier from "@/src/pages/StudentDetail/ErrorNotifier";
import HeaderSection from "@/src/pages/StudentDetail/HeaderSection";
import OverviewTab from "@/src/pages/StudentDetail/Tabs/OverviewTab";
import EnrollmentTab from "@/src/pages/StudentDetail/Tabs/EnrollmentTab";
import AddressTypeName from "@/src/pages/StudentDetail/AddressTypeName";

export default function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<{
    type: AddressType;
    address: Address;
  } | null>(null);
  const [addressFormErrors, setAddressFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressAction, setAddressAction] = useState<"add" | "edit">("edit");
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const validateAddressForm = () => {
    if (!editingAddress || !student) return false;
    // Validate form
    const errors: FormErrors = {};

    if (!editingAddress.address.street)
      errors[`${editingAddress.type}`] = "Street is required";
    if (!editingAddress.address.district)
      errors[`${editingAddress.type}`] = "District is required";
    if (!editingAddress.address.city)
      errors[`${editingAddress.type}`] = "City is required";
    if (!editingAddress.address.number)
      errors[`${editingAddress.type}`] = "Province is required";
    if (!editingAddress.address.country)
      errors[`${editingAddress.type}`] = "Country is required";

    if (Object.keys(errors).length > 0) {
      setAddressFormErrors(errors);
      return false;
    }
    return true;
  };

  const handleAddressSubmit = async () => {
    if (!editingAddress || !student) return;

    if (!validateAddressForm()) return;

    setIsSubmitting(true);

    try {
      if (addressAction === "edit" && editingAddress.address.id) {
        // Update existing address
        await AddressService.updateAddress(
          editingAddress.address.id,
          editingAddress.address,
          editingAddress.type,
        );
      } else {
        delete editingAddress.address.id; // Remove id if exists
        // Add new address
        await AddressService.addAddress(
          params.id,
          editingAddress.address,
          editingAddress.type,
        );
      }

      // Update local state
      const updatedStudent = { ...student };
      updatedStudent[editingAddress.type] = editingAddress.address as Address;
      setStudent(updatedStudent);

      // Close dialog and reset state
      setAddressDialogOpen(false);
      setEditingAddress(null);

      toast.success(
        addressAction === "edit"
          ? "Address updated successfully"
          : "Address added successfully",
      );
    } catch (err) {
      console.error(err);
      toast.error(
        addressAction === "edit"
          ? "Failed to update address"
          : "Failed to add address",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddressDialog = (type: AddressType, action: "add" | "edit") => {
    setAddressAction(action);

    if (action === "edit" && student?.[type as keyof Student]) {
      // For editing, use existing address
      setEditingAddress({
        type,
        address: { ...(student[type as keyof Student] as Address) },
      });
    } else {
      // For adding, create empty address
      setEditingAddress({
        type,
        address: {
          number: "",
          street: "",
          district: "",
          city: "",
          country: "",
        },
      });
    }

    setAddressDialogOpen(true);
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/students/${params.id}`);
        if (!res.ok) {
          throw new Error("Failed to load student data");
        }
        const data: IAPIResponse<Student> = await res.json();
        setStudent({
          ...data.data,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load student data");
        setLoading(false);
        toast.error("Failed to load student data");
      }
    };

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  if (loading) {
    return <LoadingPlaceholder />;
  }

  if (error || !student) {
    return <ErrorNotifier error={error} />;
  }

  const handleAddressChange = (field: keyof Address, value: string) => {
    if (editingAddress) {
      setEditingAddress({
        ...editingAddress,
        address: {
          ...editingAddress.address,
          [field]: value,
        },
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header section with student profile */}
      <HeaderSection student={student} />
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-5 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="academic">Học vấn</TabsTrigger>
          <TabsTrigger value="enrollment">Khóa học</TabsTrigger>
          <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          <TabsTrigger value="indentity">Thẻ định danh</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <OverviewTab student={student} openAddressDialog={openAddressDialog} />
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="mt-6">
          <AcademicTab student={student} />
        </TabsContent>

        {/* Enrollment Tab */}

        <TabsContent value="enrollment" className="mt-6">
          <EnrollmentTab student={student} />
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-6">
          <ContactTab student={student} />
        </TabsContent>

        <TabsContent value="indentity" className="mt-6">
          <IdentityPapersTab id={student.identityPaper.id!} />
        </TabsContent>
      </Tabs>

      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {addressAction === "edit" ? "Chỉnh sửa" : "Thêm"}{" "}
              {editingAddress &&
                <AddressTypeName type={editingAddress.type}/>}
            </DialogTitle>
          </DialogHeader>
          <p>{editingAddress?.address.id}</p>
          {editingAddress && (
            <AddressForm
              address={editingAddress.address}
              onChange={handleAddressChange}
              errors={addressFormErrors}
              errorKey={editingAddress.type}
            />
          )}
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setAddressDialogOpen(false);
                setEditingAddress(null);
                setAddressFormErrors({});
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleAddressSubmit} disabled={isSubmitting}>
              {isSubmitting
                ? addressAction === "edit"
                  ? "Đang lưu..."
                  : "Đang thêm..."
                : addressAction === "edit"
                  ? "Lưu thay đổi"
                  : "Thêm địa chỉ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
