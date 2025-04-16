"use client";

import React from "react";
import CourseForm from "./CourseForm";

const AddCourseForm = () => {
    return (
        <CourseForm
            onSubmit={async () => {
                await new Promise((res) => setTimeout(res, 1000));
            }}
        />
    );
};

export default AddCourseForm;
