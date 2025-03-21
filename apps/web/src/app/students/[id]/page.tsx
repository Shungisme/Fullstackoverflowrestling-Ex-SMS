"use client";

import { useEffect, useState } from "react";
import {
    Address,
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
import { Skeleton } from "@/src/components/atoms/Skeleton";
import {
    MapPin,
    Mail,
    Phone,
    Cake,
    School,
    BookOpen,
    Flag,
    User,
    Pencil,
} from "lucide-react";
import { BASE_URL } from "@/src/constants/constants";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/atoms/Dialog";
import { Button } from "@/src/components/atoms/Button";
import AddressForm from "@/src/components/molecules/AddressForm";
import IdentityPapersTab from "@/src/components/organisms/IdentityPapers";
import { toQueryString } from "@/src/utils/helper";


export default function StudentDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingAddress, setEditingAddress] = useState<{
        type: string;
        address: Address;
    } | null>(null);
    const [addressFormErrors, setAddressFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState<string | null>(null);

    const createNewAddress = async () => {
        if (!isAddingAddress || !editingAddress || !student) return;

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
            return;
        }

        setIsSubmitting(true);

        try {
            const queryString = toQueryString({
                type: isAddingAddress,
                studentId: params.id
            });
            const response = await fetch(
                `${BASE_URL}/addresses/${params.id}?${queryString}`,
                {
                    method: "POST", // Use POST for creating new address
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editingAddress.address),
                },
            );

            if (!response.ok) {
                throw new Error(`Failed to add ${isAddingAddress} address`);
            }

            // Update local state
            const updatedStudent = { ...student };
            if (isAddingAddress === "permanentAddress") {
                updatedStudent.permanentAddress = editingAddress.address;
            } else if (isAddingAddress === "temporaryAddress") {
                updatedStudent.temporaryAddress = editingAddress.address;
            }

            setStudent(updatedStudent);
            setEditingAddress(null);
            setIsAddingAddress(null);
            toast.success("Address added successfully");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to add address`);
        } finally {
            setIsSubmitting(false);
        }
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
                console.error(err);
            }
        };

        if (params.id) {
            fetchStudent();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[400px]" />
                    <Skeleton className="h-[400px]" />
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="container mx-auto py-16 px-4 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
                <p className="text-gray-600 mb-6">{error || "Student not found"}</p>
                <a
                    href="/students"
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    Back to student list
                </a>
            </div>
        );
    }

    // Get student initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    // Format date string nicely
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
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

    const updateAddress = async () => {
        if (!editingAddress || !student) return;

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
            return;
        }

        setIsSubmitting(true);

        try {
            const queryString = toQueryString({
                type: editingAddress.type
            })
            const response = await fetch(
                `${BASE_URL}/addresses/${editingAddress.address.id}?${queryString}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editingAddress.address),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to update address");
            }

            // Update local state
            const updatedStudent = { ...student };
            if (editingAddress.type === "mailingAddress") {
                updatedStudent.mailingAddress = editingAddress.address;
            } else if (editingAddress.type === "permanentAddress") {
                updatedStudent.permanentAddress = editingAddress.address;
            } else if (editingAddress.type === "temporaryAddress") {
                updatedStudent.temporaryAddress = editingAddress.address;
            }

            setStudent(updatedStudent);
            setEditingAddress(null);
            toast.success("Success");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update address");
        } finally {
            setIsSubmitting(false);
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
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="indentity">Identity Card</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Personal Information</CardTitle>
                                <CardDescription>
                                    Basic details about the student
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start">
                                        <div className="w-32 flex-shrink-0 text-muted-foreground">
                                            Full Name
                                        </div>
                                        <div className="font-medium">{student.name}</div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-32 flex-shrink-0 text-muted-foreground">
                                            Date of Birth
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Cake size={16} className="text-muted-foreground" />
                                            <span>{formatDate(student.dateOfBirth)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-32 flex-shrink-0 text-muted-foreground">
                                            Gender
                                        </div>
                                        <div>{student.gender === "MALE" ? "Male" : "Female"}</div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-32 flex-shrink-0 text-muted-foreground">
                                            Nationality
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Flag size={16} className="text-muted-foreground" />
                                            <span>{student.nationality}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="text-sm font-semibold mb-3">Student ID</h4>
                                    <div className="bg-muted p-3 rounded-md font-mono text-sm">
                                        {student.studentId}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Address Information</CardTitle>
                                <CardDescription>
                                    Student's registered addresses
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Mailing Address */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <MapPin size={16} className="text-muted-foreground" />
                                            Mailing Address
                                        </h4>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8"
                                                    onClick={() =>
                                                        setEditingAddress({
                                                            type: "mailingAddress",
                                                            address: { ...student.mailingAddress },
                                                        })
                                                    }
                                                >
                                                    <Pencil size={14} className="mr-1" />
                                                    Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Mailing Address</DialogTitle>
                                                </DialogHeader>
                                                <AddressForm
                                                    address={
                                                        editingAddress?.address || student.mailingAddress
                                                    }
                                                    onChange={handleAddressChange}
                                                    errors={addressFormErrors}
                                                    errorKey="mailing"
                                                />
                                                <DialogFooter className="mt-4">
                                                    <DialogClose asChild>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setEditingAddress(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        onClick={updateAddress}
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="bg-muted p-3 rounded-md text-sm">
                                        {student.mailingAddress.number}{" "}
                                        {student.mailingAddress.street},
                                        <br />
                                        {student.mailingAddress.district},{" "}
                                        {student.mailingAddress.city},
                                        <br />
                                        {student.mailingAddress.country}
                                    </div>
                                </div>

                                {/* Permanent Address */}
                                {student.permanentAddress ? (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <MapPin size={16} className="text-muted-foreground" />
                                                Permanent Address
                                            </h4>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8"
                                                        onClick={() => {
                                                            if (student.permanentAddress) {
                                                                setEditingAddress({
                                                                    type: "permanentAddress",
                                                                    address: student.permanentAddress,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Pencil size={14} className="mr-1" />
                                                        Edit
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Permanent Address</DialogTitle>
                                                    </DialogHeader>
                                                    <AddressForm
                                                        address={
                                                            editingAddress?.address ||
                                                            student.permanentAddress
                                                        }
                                                        onChange={handleAddressChange}
                                                        errors={addressFormErrors}
                                                        errorKey="permanentAddress"
                                                    />
                                                    <DialogFooter className="mt-4">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setEditingAddress(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={updateAddress}
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? "Saving..." : "Save Changes"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="bg-muted p-3 rounded-md text-sm">
                                            {student.permanentAddress.number}{" "}
                                            {student.permanentAddress.street},
                                            <br />
                                            {student.permanentAddress.district},{" "}
                                            {student.permanentAddress.city},
                                            <br />
                                            {student.permanentAddress.country}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                                            <MapPin size={16} className="text-muted-foreground" />
                                            Permanent Address
                                        </h4>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full flex items-center justify-center gap-2 p-3 border-dashed"
                                                    onClick={() => {
                                                        setIsAddingAddress("permanentAddress");
                                                        setEditingAddress({
                                                            type: "permanentAddress",
                                                            address: {
                                                                number: "",
                                                                street: "",
                                                                district: "",
                                                                city: "",
                                                                country: "",
                                                            },
                                                        });
                                                    }}
                                                >
                                                    <Pencil size={14} />
                                                    Add Permanent Address
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Permanent Address</DialogTitle>
                                                </DialogHeader>
                                                <AddressForm
                                                    address={
                                                        editingAddress?.address || {
                                                            number: "",
                                                            street: "",
                                                            district: "",
                                                            city: "",
                                                            country: "",
                                                        }
                                                    }
                                                    onChange={handleAddressChange}
                                                    errors={addressFormErrors}
                                                    errorKey="permanentAddress"
                                                />
                                                <DialogFooter className="mt-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditingAddress(null);
                                                            setIsAddingAddress(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={createNewAddress}
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? "Adding..." : "Add Address"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )}

                                {/* Temporary Address */}
                                {student.temporaryAddress ? (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <MapPin size={16} className="text-muted-foreground" />
                                                Temporary Address
                                            </h4>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8"
                                                        onClick={() => {
                                                            if (student.temporaryAddress) {
                                                                setEditingAddress({
                                                                    type: "temporaryAddress",
                                                                    address: student.temporaryAddress,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Pencil size={14} className="mr-1" />
                                                        Edit
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Temporary Address</DialogTitle>
                                                    </DialogHeader>
                                                    <AddressForm
                                                        address={
                                                            editingAddress?.address ||
                                                            student.temporaryAddress
                                                        }
                                                        onChange={handleAddressChange}
                                                        errors={addressFormErrors}
                                                        errorKey="temporary"
                                                    />
                                                    <DialogFooter className="mt-4">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setEditingAddress(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={updateAddress}
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? "Saving..." : "Save Changes"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="bg-muted p-3 rounded-md text-sm">
                                            {student.temporaryAddress.number}{" "}
                                            {student.temporaryAddress.street},
                                            <br />
                                            {student.temporaryAddress.district},{" "}
                                            {student.temporaryAddress.city},
                                            <br />
                                            {student.temporaryAddress.country}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                                            <MapPin size={16} className="text-muted-foreground" />
                                            Temporary Address
                                        </h4>
                                        <Dialog open={isAddingAddress !== null}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full flex items-center justify-center gap-2 p-3 border-dashed"
                                                    onClick={() => {
                                                        setIsAddingAddress("temporaryAddress");
                                                        setEditingAddress({
                                                            type: "temporaryAddress",
                                                            address: {
                                                                number: "",
                                                                street: "",
                                                                district: "",
                                                                city: "",
                                                                country: "",
                                                            },
                                                        });
                                                    }}
                                                >
                                                    <Pencil size={14} />
                                                    Add Temporary Address
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Temporary Address</DialogTitle>
                                                </DialogHeader>
                                                <AddressForm
                                                    address={
                                                        editingAddress?.address || {
                                                            number: "",
                                                            street: "",
                                                            district: "",
                                                            city: "",
                                                            country: "",
                                                        }
                                                    }
                                                    onChange={handleAddressChange}
                                                    errors={addressFormErrors}
                                                    errorKey="temporary"
                                                />
                                                <DialogFooter className="mt-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditingAddress(null);
                                                            setIsAddingAddress(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={createNewAddress}
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? "Adding..." : "Add Address"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Academic Tab */}
                <TabsContent value="academic" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Academic Information</CardTitle>
                            <CardDescription>Student's educational details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">
                                            Faculty
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <School size={18} className="text-primary" />
                                            <span className="font-medium">{student.faculty.title}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">
                                            Program
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={18} className="text-primary" />
                                            <span className="font-medium">{student.program.title}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">
                                            Course
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                Year {student.course}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">
                                            Status
                                        </span>
                                        <Badge className="w-fit">{student.status.title}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Contact Information</CardTitle>
                            <CardDescription>Ways to reach the student</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                                        <Phone size={16} className="text-muted-foreground" />
                                        Phone Number
                                    </h4>
                                    <div className="bg-muted p-3 rounded-md">
                                        <a
                                            href={`tel:${student.phone}`}
                                            className="text-primary hover:underline"
                                        >
                                            {student.phone}
                                        </a>
                                    </div>
                                </div>

                                {student.email && (
                                    <div>
                                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                                            <Mail size={16} className="text-muted-foreground" />
                                            Email Address
                                        </h4>
                                        <div className="bg-muted p-3 rounded-md">
                                            <a
                                                href={`mailto:${student.email}`}
                                                className="text-primary hover:underline break-all"
                                            >
                                                {student.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-3">
                                    Emergency Contact
                                </h4>
                                <div className="bg-muted p-4 rounded-md text-center text-sm text-muted-foreground">
                                    No emergency contact information available
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Identity Card Tab */}
                <TabsContent value="indentity" className="mt-6">
                    <IdentityPapersTab id={student.identityPaper.id!} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
