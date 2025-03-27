"use client";

import { Button } from "@/src/components/atoms/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/Card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/atoms/Dialog";
import { Separator } from "@/src/components/atoms/Separator";
import AddressForm from "@/src/components/molecules/AddressForm";
import { AddressService } from "@/src/lib/api/address-service";
import { FormErrors, Student } from "@/src/types";
import { Address } from "@/src/types";
import { TabsContent } from "@repo/ui";
import { formatDate } from "date-fns";
import { Cake, Flag, MapPin, Pencil } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface OverviewTabProps {
  student: Student;
  setStudent: Dispatch<SetStateAction<Student | null>>;
}

type AddressType = "mailingAddress" | "permanentAddress" | "temporaryAddress";

const OverviewTab = ({ student, setStudent }: OverviewTabProps) => {
  const [editingAddress, setEditingAddress] = useState<{
    type: AddressType;
    address: Address;
    mode: "edit" | "add";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressFormErrors, setAddressFormErrors] = useState<FormErrors>({});

  const validateForm = () => {
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

    setAddressFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (type: AddressType) => {
    let address;
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
  const handleSubmitAddress = async () => {
    if (!editingAddress || !validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingAddress.mode === "edit") {
        await AddressService.updateAddress(
          editingAddress.address.id!,
          editingAddress.address,
          editingAddress.type,
        );
      } else {
        await AddressService.addAddress(
          student.id!,
          editingAddress.address,
          editingAddress.type,
        );
      }

      // Update local state
      const updatedStudent = { ...student } as Student;
      if (editingAddress.type === "mailingAddress") {
        updatedStudent.mailingAddress = editingAddress.address;
      } else if (editingAddress.type === "permanentAddress") {
        updatedStudent.permanentAddress = editingAddress.address;
      } else if (editingAddress.type === "temporaryAddress") {
        updatedStudent.temporaryAddress = editingAddress.address;
      }

      setStudent(updatedStudent);
      setEditingAddress(null);
      toast.success("Address saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TabsContent value="overview" className="mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        {InfoCard(student)}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Thông tin địa chỉ</CardTitle>
            <CardDescription>
              Các địa chỉ được đăng ký của sinh viên
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mailing Address */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  Địa chỉ nhận thư
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => handleOpenDialog("mailingAddress")}
                >
                  <Pencil size={14} className="mr-1" />
                  Chỉnh sửa
                </Button>
                <Dialog>
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
                      <Button onClick={updateAddress} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="bg-muted p-3 rounded-md text-sm">
                {student.mailingAddress.number} {student.mailingAddress.street},
                <br />
                {student.mailingAddress.district}, {student.mailingAddress.city}
                ,
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
                    Địa chỉ thường trú
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
                          editingAddress?.address || student.permanentAddress
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
                        <Button onClick={updateAddress} disabled={isSubmitting}>
                          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
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
                          editingAddress?.address || student.temporaryAddress
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
                        <Button onClick={updateAddress} disabled={isSubmitting}>
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
  );
};

export default OverviewTab;

function InfoCard(student: Student) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
        <CardDescription>Các thông tin cơ bản về sinh viên</CardDescription>
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
              <span>{formatDate(student.dateOfBirth, "dd/MM/yyyy")}</span>
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
  );
}
