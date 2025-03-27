"use client";

import { useEffect, useState } from "react";
import {
    Address,
    AddressType,
    FormErrors,
    IAPIResponse,
    Student,
} from "@/src/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/atoms/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/atoms/Avatar";
import { Badge } from "@/src/components/atoms/Badge";
import { Separator } from "@/src/components/atoms/Separator";
import { Cake, School, Flag, User } from "lucide-react";
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
import { formatDate } from "date-fns";
import { AddressService } from "@/src/lib/api/address-service";
import AcademicTab from "@/src/pages/StudentDetail/Tabs/AcademicTab";
import ContactTab from "@/src/pages/StudentDetail/Tabs/ContactTab";
import LoadingPlaceholder from "@/src/pages/StudentDetail/LoadingPlaceholder";
import ErrorNotifier from "@/src/pages/StudentDetail/ErrorNotifier";
import AddressInfo from "@/src/pages/StudentDetail/AddressInfo";
import AddAddressPlaceholder from "@/src/pages/StudentDetail/AddAddressPlaceholder";

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

    // Get student initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                            alt={student.name}
                        />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{student.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                                <User size={16} />
                                ID: {student.studentId}
                            </span>
                            <span className="hidden md:inline">•</span>
                            <span className="flex items-center gap-1">
                                <School size={16} />
                                {student.faculty.title}
                            </span>
                        </div>
                    </div>
                </div>
                <Badge className="text-xs py-1 px-3">{student.status.title}</Badge>
            </div>

            <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="academic">Học vấn</TabsTrigger>
                    <TabsTrigger value="contact">Liên hệ</TabsTrigger>
                    <TabsTrigger value="indentity">Thẻ định danh</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
                                <CardDescription>
                                    Các thông tin cơ bản về sinh viên
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start">
                                        <div className="w-32 flex-shrink-0 text-muted-foreground">
                                            Họ tên
                                        </div>
                                        <div className="font-medium">{student.name}</div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-32 flex-shrink-0 text-muted-foreground">
                                            Ngày sinh
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Cake size={16} className="text-muted-foreground" />
                                            <span>
                                                {formatDate(student.dateOfBirth, "dd/MM/yyyy")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-32 flex-shrink-0 text-muted-foreground">
                                            Giới tính
                                        </div>
                                        <div>{student.gender === "MALE" ? "Nam" : "Nữ"}</div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-32 flex-shrink-0 text-muted-foreground">
                                            Quốc tịch
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Flag size={16} className="text-muted-foreground" />
                                            <span>{student.nationality}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="text-sm font-semibold mb-3">MSSV</h4>
                                    <div className="bg-muted p-3 rounded-md font-mono text-sm">
                                        {student.studentId}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Thông tin địa chỉ</CardTitle>
                                <CardDescription>
                                    Các địa chỉ được đăng ký của sinh viên
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Mailing Address */}
                                <AddressInfo
                                    type="mailingAddress"
                                    openAddressDialog={openAddressDialog}
                                    address={student.mailingAddress}
                                />
                                {/* Permanent Address */}
                                {student?.permanentAddress ? (
                                    <AddressInfo
                                        type="permanentAddress"
                                        openAddressDialog={openAddressDialog}
                                        address={student.permanentAddress}
                                    />
                                ) : (
                                    <AddAddressPlaceholder
                                        openAddressDialog={openAddressDialog}
                                        type="permanentAddress"
                                    />
                                )}
                                {/* Temporary Address */}
                                {student?.temporaryAddress ? (
                                    <AddressInfo
                                        type="temporaryAddress"
                                        openAddressDialog={openAddressDialog}
                                        address={student.temporaryAddress}
                                    />
                                ) : (
                                    <AddAddressPlaceholder
                                        openAddressDialog={openAddressDialog}
                                        type="temporaryAddress"
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <AcademicTab student={student} />

                <ContactTab student={student} />

                <TabsContent value="indentity" className="mt-6">
                    <IdentityPapersTab id={student.identityPaper.id!} />
                </TabsContent>
            </Tabs>

            <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {addressAction === "edit" ? "Edit" : "Thêm"}{" "}
                            {editingAddress &&
                                AddressService.getAddressTypeName(editingAddress.type)}
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
                            Cancel
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
