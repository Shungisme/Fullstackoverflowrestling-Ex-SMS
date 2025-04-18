import CourseListPage from "@/src/pages/Courses/CourseListPage";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/atoms/Tabs";
import React from "react";

const CoursesPage = () => {
    return (
        <Tabs
            orientation="vertical"
            defaultValue="course-list"
            className="flex gap-4"
        >
            <TabsList className="flex flex-col h-full">
                <TabsTrigger value="course-list">Danh sách môn học</TabsTrigger>
                <TabsTrigger value="class-list">Danh sách lớp học</TabsTrigger>
            </TabsList>
            <div className="flex-1">
                <TabsContent value="course-list">
                    <CourseListPage />
                </TabsContent>
                <TabsContent value="class-list">
                    <div className="space-y-4">class-list</div>
                </TabsContent>
            </div>
        </Tabs>
    );
};

export default CoursesPage;
