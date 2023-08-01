"use client";

import React, { useEffect, useState } from "react";

import Loading from "@/app/components/Loading";
import Paginator from "@/app/components/Paginator";
import ReportsTable from "@/app/components/ReportsTable";

const STATUS = ["pending", "approved", "rejected"];

const validateReportInput = (status, duration) => {
    // Status must be one of the following: pending, approved, rejected
    if (!STATUS.includes(status)) return false;

    // Must be in the format of: NUMBER_{d|m|h}
    if (!/^\d+_[d|m|h]$/.test(duration)) return false;

    return true;
};

export default function ReportedUsers() {
    const [page, setPage] = useState(1);
    const [reports, setReports] = useState();
    const [limit, setLimit] = useState();
    const [totalPages, setTotalPages] = useState();
    const [totalReports, setTotalReports] = useState();

    const [sortBy, setSortBy] = useState("name"); // Default sort by is 'name'
    const [sortOrder, setSortOrder] = useState("ASC"); // Default sort order is 'ASC'

    const handleNext = () => setPage((prevPage) => prevPage + 1);
    const handlePrev = () => setPage((prevPage) => prevPage - 1);

    const handleSort = (field) => {
        setSortBy(field);
        setSortOrder((prevOrder) => (prevOrder === "ASC" ? "DESC" : "ASC"));
    };

    const handleNameClick = () => {
        alert("Go to userProfile");
    };

    const fetchReports = async (page, sortBy, sortOrder) => {
        try {
            const res = await fetch(
                `/api/reports?page=${page}&sortby=${sortBy}&order=${sortOrder}`,
                {
                    cache: "no-store",
                }
            );
            const { data } = await res.json();

            setReports(data.reports);
            setLimit(data.limit);
            setTotalPages(data.totalPages);
            setTotalReports(data.totalReports);
        } catch (error) {
            console.log("Something went wrong:", error.message);
        }
    };

    const handleSubmit = async (event, status, duration, reportId) => {
        event.preventDefault();

        try {
            if (!validateReportInput(status, duration))
                throw new Error("Invalid input.");

            const report = {
                status,
                duration,
            };

            const res = await fetch(`/api/reports/${reportId}`, {
                method: "PUT",
                body: JSON.stringify(report),
            });
            const { ok } = await res.json();
            if (!ok) throw new Error("Something went wrong.");

            await fetchReports(page, sortBy, sortOrder);
        } catch (error) {
            console.log("Something went wrong:", error.message);
        }
    };

    useEffect(() => {
        fetchReports(page, sortBy, sortOrder);
    }, [page, sortBy, sortOrder]);

    if (!reports) return <Loading />;

    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="h-1/2">
                <div className="flex">
                    <div className="flex-1 m-2">
                        <h2 className="px-4 py-2 text-2xl font-bold text-white">
                            List of Reported Users
                        </h2>
                    </div>
                </div>

                <hr className="border-indigo-600" />

                <ReportsTable
                    reports={reports}
                    handleSort={handleSort}
                    handleNameClick={handleNameClick}
                    handleSubmit={handleSubmit}
                />

                <Paginator
                    page={page}
                    totalPages={totalPages}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    totalReports={totalReports}
                    limit={limit}
                />
            </div>
        </div>
    );
}
