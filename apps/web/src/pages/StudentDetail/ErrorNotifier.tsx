import React from "react";

const ErrorNotifier = ({ error }: { error: string | null }) => {
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
};

export default ErrorNotifier;
