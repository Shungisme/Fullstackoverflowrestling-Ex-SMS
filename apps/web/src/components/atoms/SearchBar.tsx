"use client";

import { Input } from "@repo/ui";
import React from "react";
import { Button } from "./Button";
import LoadingSpinner from "../LoadingSpinner";

type SearchBarProps = {
    onSearch: (searchTerm: string) => void;
    isLoading: boolean;
    placeholder?: string;
    value?: string;
};

const SearchBar = ({
    onSearch,
    value = "",
    isLoading,
    placeholder = "Tìm kiếm...",
}: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = React.useState<string>(value);

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            onSearch(searchTerm);
        }
    };

    return (
        <div className="flex w-full gap-4">
            <div className="flex-1">
                <Input
                    type="text"
                    disabled={isLoading}
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
