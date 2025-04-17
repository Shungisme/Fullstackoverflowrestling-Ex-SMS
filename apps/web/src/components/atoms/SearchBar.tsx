"use client";

import { Input } from "@repo/ui";
import React from "react";
import { Button } from "./Button";
import LoadingSpinner from "../LoadingSpinner";

type SearchBarProps = {
    placeholder?: string;
};

const SearchBar = ({
    placeholder = "Tìm kiếm...",
}: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [isLoading, _] = React.useState<boolean>(false);

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            console.log(searchTerm);
        }
    };

    return (
        <div className="flex w-full gap-4">
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    className="w-full border border-zinc-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
            </div>
            <Button variant="outline" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : <span>Tìm kiếm</span>}
            </Button>
        </div>
    );
};

export default SearchBar;
