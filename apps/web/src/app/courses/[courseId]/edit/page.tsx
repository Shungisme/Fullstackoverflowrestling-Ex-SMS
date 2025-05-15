import EditPage from "@/src/pages/Courses/CourseDetail/EditPage";
import React from "react";

const EditCoursePage = async ({ params }: { params: { courseId: string } }) => {
    return <EditPage courseId={params.courseId} />;
};

export default EditCoursePage;
