import { Skeleton } from "@/src/components/atoms/Skeleton";
import React from "react";

const LoadingPlaceholder = () => {
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
};

export default LoadingPlaceholder;
