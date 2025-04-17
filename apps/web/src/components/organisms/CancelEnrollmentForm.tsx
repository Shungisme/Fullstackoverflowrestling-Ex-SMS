"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/atoms/Form";
import { Button } from "@/src/components/atoms/Button";
import { Textarea } from "@/src/components/atoms/Textarea";
import { toast } from "sonner";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { Enrollment, EnrollmentStatus } from "@/src/types/enrollment";
import {
  cancelEnrollment,
  checkCancellationEligibility,
} from "@/src/lib/api/enrollment-service";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/components/atoms/Alert";
import { AlertCircle, Clock } from "lucide-react";
import { formatDate } from "date-fns";

const cancelFormSchema = z.object({
  reason: z
    .string()
    .min(1, { message: "Lý do không được để trống" })
    .max(500, { message: "Lý do không quá 500 ký tự" }),
});

type CancelEnrollmentFormProps = {
  enrollment: Enrollment;
  onSuccess: () => void;
  onCancel: () => void;
};

export function CancelEnrollmentForm({
  enrollment,
  onSuccess,
  onCancel,
}: CancelEnrollmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState<{
    eligible: boolean;
    message: string;
  } | null>(null);

  const form = useForm<z.infer<typeof cancelFormSchema>>({
    resolver: zodResolver(cancelFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Check if enrollment can be canceled
  React.useEffect(() => {
    async function checkEligibility() {
      try {
        if (enrollment.type === EnrollmentStatus.DROP) {
          setEligibilityStatus({
            eligible: false,
            message: "Đăng ký khóa học này đã bị hủy trước đó.",
          });
          return;
        }

        if (enrollment.type === EnrollmentStatus.FAIL) {
          setEligibilityStatus({
            eligible: false,
            message: "Đăng ký khóa học này đã bị thất bại trước đó.",
          });
          return;
        }

        const response = await checkCancellationEligibility(enrollment.id!);
        setEligibilityStatus(response.data);
      } catch (error) {
        setEligibilityStatus({
          eligible: false,
          message: "Không thể kiểm tra khả năng hủy đăng ký.",
        });
      }
    }

    checkEligibility();
  }, [enrollment]);

  const onSubmit = async (values: z.infer<typeof cancelFormSchema>) => {
    if (!eligibilityStatus?.eligible) {
      toast.error("Không thể hủy đăng ký khóa học này");
      return;
    }

    setIsLoading(true);

    try {
      await cancelEnrollment(enrollment.id!);
      toast.success("Hủy đăng ký khóa học thành công");
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra khi hủy đăng ký khóa học");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Hủy đăng ký khóa học</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Bạn đang hủy đăng ký cho khóa học sau
        </p>
      </div>

      <div className="bg-muted p-4 rounded-md">
        <div className="space-y-2">
          <div className="grid grid-cols-3">
            <span className="text-sm font-medium">Mã sinh viên:</span>
            <span className="text-sm col-span-2">{enrollment.studentId}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-sm font-medium">Tên sinh viên:</span>
            <span className="text-sm col-span-2">
              {enrollment.student?.name}
            </span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-sm font-medium">Khóa học:</span>
            <span className="text-sm col-span-2">
              {enrollment.class?.subjectCode}
            </span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-sm font-medium">Lớp học:</span>
            <span className="text-sm col-span-2">{enrollment.class?.code}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-sm font-medium">Ngày đăng ký:</span>
            <span className="text-sm col-span-2">
              {formatDate(new Date(enrollment.createdAt), "dd/MM/yyyy")}
            </span>
          </div>
        </div>
      </div>

      {eligibilityStatus && (
        <Alert variant={eligibilityStatus.eligible ? "default" : "destructive"}>
          {eligibilityStatus.eligible ? (
            <>
              <Clock className="h-4 w-4" />
              <AlertTitle>Còn trong thời hạn hủy đăng ký</AlertTitle>
              <AlertDescription>
                Bạn có thể hủy đăng ký khóa học này
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không thể hủy đăng ký</AlertTitle>
              <AlertDescription>{eligibilityStatus.message}</AlertDescription>
            </>
          )}
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lý do hủy đăng ký</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={!eligibilityStatus?.eligible || isLoading}
                    placeholder="Nhập lý do hủy đăng ký khóa học"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !eligibilityStatus?.eligible}
            >
              {isLoading ? <LoadingSpinner /> : "Xác nhận hủy đăng ký"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
