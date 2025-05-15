"use client";

import { Button } from "@/src/components/atoms/Button";
import { Plus, Filter, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import CoursesTable from "./CoursesTable";
import { CourseService } from "@/src/lib/api/school-service";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/Select";
import { Course, CourseStatus } from "@/src/types/course";
import { Card, CardContent } from "@/src/components/atoms/Card";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { useLanguage } from "@/src/context/LanguageContext";
import { Label } from "@repo/ui";

const CourseListPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    facultyId: "all",
    status: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { faculties } = useSchoolConfigContext();
  const { language } = useLanguage();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // Create array of query string parameters
      const queryParams = [];

      if (filters.facultyId !== "all") {
        queryParams.push(`facultyId=${filters.facultyId}`);
      }

      if (filters.status !== "all") {
        queryParams.push(`status=${filters.status}`);
      }
      const service = new CourseService(language);
      const response = await service.getAll(queryParams);
      setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      facultyId: "",
      status: "",
    });
  };

  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button asChild>
          <a href="/courses/new" className="flex items-center">
            <Plus className="mr-2" />
            {t("CoursesList_AddCourse")}
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center"
        >
          <Filter className="mr-2 h-4 w-4" />
          {showFilters
            ? t("CoursesList_HideFilter")
            : t("CoursesList_ShowFilter")}
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-64">
                <Label className="text-sm font-medium mb-1 block">
                  {t("studentFaculty")}
                </Label>
                <Select
                  value={filters.facultyId}
                  onValueChange={(value) =>
                    handleFilterChange("facultyId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("CoursesList_FilterFacultyAll")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("CoursesList_FilterFacultyAll")}
                    </SelectItem>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id!}>
                        {faculty.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-64">
                <Label className="text-sm font-medium mb-1 block">
                  {t("CoursesList_FilterStatusLabel")}
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("CoursesList_FilterStatusAll")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("CoursesList_FilterStatusAll")}
                    </SelectItem>
                    <SelectItem value={CourseStatus.ACTIVE}>
                      {t("CoursesList_FilterStatusActive")}
                    </SelectItem>
                    <SelectItem value={CourseStatus.INACTIVE}>
                      {t("CoursesList_FilterStatusInactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="flex items-center"
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                {t("CoursesList_ClearFilter")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <LoadingSpinner />
          <span className="ml-2">{t("notiLoading")}</span>
        </div>
      ) : (
        <CoursesTable data={courses || []} isLoading={false} />
      )}
    </div>
  );
};

export default CourseListPage;
