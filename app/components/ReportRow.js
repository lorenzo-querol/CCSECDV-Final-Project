import { useState } from "react";

const getStatus = (status) => {
    switch (status) {
        case "pending":
            return (
                <div className="px-2 py-1 bg-yellow-500 rounded-lg">
                    Pending
                </div>
            );
        case "approved":
            return (
                <div className="px-2 py-1 bg-green-500 rounded-lg">
                    Approved
                </div>
            );
        case "rejected":
            return (
                <div className="px-2 py-1 bg-red-500 rounded-lg">Rejected</div>
            );
    }
};

export default function ReportRow({ report, handleNameClick, handleSubmit }) {
    const [timeValue, setTimeValue] = useState("");
    const [timeUnit, setTimeUnit] = useState("m");

    const handleTimeValueChange = (value) => {
        setTimeValue(value);
    };

    const handleTimeUnitChange = (value) => {
        setTimeUnit(value);
    };
    return (
        <tr>
            <td
                className="px-4 py-2 border-b cursor-pointer"
                
                onClick={() => {handleNameClick(report.post_id)}}
            >
                {report.name}
            </td>
            <td className="px-4 py-2 border-b">{report.description}</td>
            <td className="px-4 py-2 border-b">
                <div className="flex items-center justify-center ">
                    {getStatus(report.status)}
                </div>
            </td>
            <td className="items-center px-4 py-2 border-b">
                {!report.cooldown_until && (
                    <div className="flex items-center justify-center space-x-2">
                        {/* Time */}
                        <input
                            name="timeValue"
                            type="number"
                            inputMode="text"
                            className="p-2 bg-transparent border-b-2 border-indigo-500 outline-none w-28"
                            placeholder="Enter value"
                            value={timeValue}
                            onChange={(event) =>
                                handleTimeValueChange(event.target.value)
                            }
                        />
                        <select
                            name="timeUnit"
                            className="p-2 bg-transparent border-b-2 border-indigo-500 outline-none w-28"
                            value={timeUnit}
                            onChange={(event) =>
                                handleTimeUnitChange(event.target.value)
                            }
                        >
                            <option value="m" className="bg-indigo-500">
                                Minutes
                            </option>
                            <option value="h" className="bg-indigo-500">
                                Hours
                            </option>
                            <option value="d" className="bg-indigo-500">
                                Days
                            </option>
                        </select>
                    </div>
                )}
            </td>
            <td className="px-4 py-2 border-b">
                {report.cooldown_until &&
                    new Date(report.cooldown_until).toLocaleString()}
            </td>
            <td className="px-4 py-2 border-b">
                {!report.cooldown_until && (
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            className="flex justify-center px-2 py-1 bg-green-500 rounded-lg hover:bg-green-700"
                            onClick={(event) =>
                                handleSubmit(
                                    event,
                                    "approved",
                                    `${timeValue}_${timeUnit}`,
                                    report.report_id
                                )
                            }
                        >
                            {/* <AiFillCheckCircle className="text-green-500" size={20} /> */}
                            Submit
                        </button>
                        <button
                            className="flex justify-center px-2 py-1 bg-red-500 rounded-lg hover:bg-red-700"
                            onClick={(event) =>
                                handleSubmit(
                                    event,
                                    "rejected",
                                    `${timeValue}_${timeUnit}`,
                                    report.report_id
                                )
                            }
                        >
                            {/* <AiFillCloseCircle className="text-red-500" size={20} /> */}
                            Reject
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}
