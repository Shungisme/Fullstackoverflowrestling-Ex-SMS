import React, { Suspense } from "react";
import PageHeader from "./PageHeader";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ErrorBoundary from "@/src/components/molecules/ErrorBoundary";
import StudentStats from "../Home/Stats/StudentStats";
import StudentManagementClient from "./StudentManagementClient";

const StudentManagementPage = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Hệ thống Quản lý Sinh viên"
        description="Quản lý và theo dõi sinh viên trong một giao diện đơn giản."
      />
      <ErrorBoundary fallback={<p>{"Đã xảy ra lỗi khi tải thống kê."}</p>}>
        <Suspense fallback={<LoadingSpinner />}>
          <StudentStats />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary
        fallback={<p>{"Đã xảy ra lỗi khi tải quản lý sinh viên."}</p>}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <StudentManagementClient />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default StudentManagementPage;
