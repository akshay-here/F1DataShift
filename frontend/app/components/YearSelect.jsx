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

function YearSelect({ currentYear, endpoint }) {

    const router = useRouter();
    const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i).reverse();

    const handleYearChange = (year) => {
        router.push(`/${endpoint}/${year}`);            // ex: standings/20205 or races/2025
    }

    return (
        <Select defaultValue={currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="bg-black text-white border-white hover:bg-purple-500 hover:text-black focus:ring-purple-500 rounded-md shadow-md">
                <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-white">
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="hover:bg-purple-500 hover:text-black focus:bg-purple-500 focus:text-black">
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )


}
export default YearSelect
