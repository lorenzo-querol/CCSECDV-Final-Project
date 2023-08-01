export default function ReportRow() {
	return (
		<tr>
			<td
				className="px-4 py-2 border-b cursor-pointer"
				onClick={handleNameClick}
			>
				name
			</td>
			<td className="px-4 py-2 border-b">description</td>
			<td className="px-4 py-2 border-b">
				<div className="flex items-center justify-center ">
					<div className="px-2 py-1 bg-yellow-500 rounded-lg">Pending</div>
					<div className="px-2 py-1 bg-green-500 rounded-lg">Approved</div>
					<div className="px-2 py-1 bg-red-500 rounded-lg">Disapproved</div>
				</div>
			</td>
			<td className="items-center px-4 py-2 border-b">
				<div className="flex items-center justify-center space-x-2">
					{/* Time */}
					<input
						type="number"
						name="timeValue"
						className="p-2 bg-transparent border-b-2 border-indigo-500 outline-none w-28"
						placeholder="Enter value"
						value={timeValue}
						onChange={handleTimeChange}
					/>
					<select
						name="timeUnit"
						className="p-2 bg-transparent border-b-2 border-indigo-500 outline-none w-28"
						value={timeUnit}
						onChange={handleTimeChange}
					>
						<option
							value="minutes"
							className="bg-indigo-500"
						>
							Minutes
						</option>
						<option
							value="hours"
							className="bg-indigo-500"
						>
							Hours
						</option>
						<option
							value="days"
							className="bg-indigo-500"
						>
							Days
						</option>
					</select>
				</div>
			</td>
			<td className="px-4 py-2 border-b">countdown</td>
			<td className="px-4 py-2 border-b">
				{/* Buttons */}
				<div className="flex items-center justify-center space-x-2">
					<button className="flex justify-center px-2 py-1 bg-green-500 rounded-lg hover:bg-green-700">
						{/* <AiFillCheckCircle className="text-green-500" size={20} /> */}
						Submit
					</button>
					<button className="flex justify-center px-2 py-1 bg-red-500 rounded-lg hover:bg-red-700">
						{/* <AiFillCloseCircle className="text-red-500" size={20} /> */}
						Disregard
					</button>
				</div>
			</td>
		</tr>
	);
}
