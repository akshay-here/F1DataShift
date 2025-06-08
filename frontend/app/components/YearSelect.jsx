'use client';

import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import React from 'react'

function YearSelect({ currentYear }) {

    const router = useRouter();
    const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i).reverse();

    const handleYearChange = (year) => {
        router.push(`/standings/${year}`);
    }

    return (
        <Select defaultValue={currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )


}
export default YearSelect
