"use client";
import React, { Suspense } from "react";
import PageHeader from "./PageHeader";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ErrorBoundary from "@/src/components/molecules/ErrorBoundary";
import StudentStats from "../Home/Stats/StudentStats";
import StudentManagementClient from "./StudentManagementClient";
import { useLanguage } from "@/src/context/LanguageContext";

const StudentManagementPage = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <PageHeader
        title={t("dashboardHeaderTitle")}
        description={t("dashboardHeaderDesc")}
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
