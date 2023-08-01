import { BiSort } from "react-icons/bi";
import ReportRow from "./ReportRow";

export default function ReportsTable({
    reports,
    handleSort,
    handleNameClick,
    handleSubmit,
}) {
    return (
        <div className="flex items-center my-2 text-base">
            <table className="table w-full mx-auto text-center shadow-md">
                <thead>
                    <tr>
                        <th className="w-1/6 px-4 py-2 border-b ">
                            <div className="flex items-center justify-center">
                                Name
                                <button
                                    onClick={() => handleSort("name")}
                                    className="flex justify-center"
                                >
                                    <BiSort size={20} />
                                </button>
                            </div>
                        </th>
                        <th className="w-1/6 px-4 py-2 border-b">
                            <div className="flex items-center justify-center">
                                Report
                                <button
                                    onClick={() => handleSort("report")}
                                    className="flex justify-center"
                                >
                                    <BiSort size={20} />
                                </button>
                            </div>
                        </th>
                        <th className="w-1/6 px-4 py-2 border-b">
                            <div className="flex items-center justify-center">
                                Report Status
                                <button
                                    onClick={() => handleSort("status")}
                                    className="flex justify-center"
                                >
                                    <BiSort size={20} />
                                </button>
                            </div>
                        </th>
                        <th className="w-1/6 px-4 py-2 border-b">
                            <div className="flex items-center justify-center">
                                Set Cooldown
                            </div>
                        </th>
                        <th className="w-1/6 px-4 py-2 border-b">
                            <div className="flex items-center justify-center">
                                Cooldown Until
                            </div>
                        </th>
                        <th className="w-1/6 px-4 py-2 border-b">
                            <div className="flex items-center justify-center">
                                Action
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="items-center justify-center w-full mx-auto">
                    {reports.map((report, index) => (
                        <ReportRow
                            key={index}
                            report={report}
                            handleNameClick={handleNameClick}
                            handleSubmit={handleSubmit}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
