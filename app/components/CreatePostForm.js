import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";

import { BiImage } from "react-icons/bi";
import Image from "next/image";
import { useState } from "react";

const MAX_LENGTH = 180;

export default function CreatePostForm({
	handleSubmit,
	image,
	user,
	imageError,
	handleTextChange,
	remainingCharacters,
	handleImageChange,
	handleRemoveImage,
	handleButton
}) {
	return (
		<form onSubmit={handleSubmit} className="border-b">
			<div className="flex py-2">
				<div className="w-10 py-1 m-2">
					<Image
						className="inline-block w-10 h-10 rounded-full"
						src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${user.avatar}`}
						style={{
							objectFit: "cover",
						}}
						width={40}
						height={40}
						alt=""
					/>
				</div>
				<div className="flex-1 px-2 pt-2 mt-2">
					{/* Textarea */}
					<textarea
						className="w-full p-2 text-lg font-medium text-gray-400 bg-transparent"
						rows="2"
						cols="50"
						name="post-textarea"
						placeholder="What's happening?"
						onChange={handleTextChange}
					></textarea>

					{/* Remaining characters */}
					<div className="flex justify-center">
						{remainingCharacters < 0 ? (
							<p className="items-center font-semibold text-red-500">
								{" "}
								Maximum character count exceeded ({MAX_LENGTH}).{" "}
							</p>

						) : (
							<p className="items-center font-semibold text-gray-500">
								{remainingCharacters}/{MAX_LENGTH}
							</p>
						)}
					</div>

					{/* Image Preview */}
					{image && !imageError && (
						<div className="relative mt-2">
							<button
								onClick={handleRemoveImage}
								className="absolute top-0 right-0 p-2 text-red-500"
							>
								<AiFillCloseCircle size={25} />
							</button>
							<Image
								src={image}
								alt="Image Preview"
								className="max-w-40 max-h-64"
								width="1920"
								height="1080"
								style={{ objectFit: 'contain' }}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Create posts icons */}
			<div className="flex">
				<div className="w-10"></div>
				<div className="w-64 px-2">
					{/* Icons */}
					<div className="flex items-center">
						{/* Upload image */}
						<div className="flex items-center p-1 m-2">
							<label
								htmlFor="upload-image"
								className="flex items-center p-2 mt-1 text-base font-medium leading-6 text-indigo-400 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
							>
								<BiImage
									size={25}
									className="flex items-center"
								/>
							</label>
							<input
								id="upload-image"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleImageChange} // Add onChange event here
							/>
						</div>
						{/* Display error message if there's an error */}
						{imageError && (
							<p className="text-sm text-red-500">{imageError}</p>
						)}
					</div>
				</div>

				{/* Post Button */}
				<div className="flex-1">
					<button
						disabled={handleButton}
						type="submit" // Set the button type to submit
						className="float-right px-8 py-2 mt-4 mr-8 font-bold text-white bg-indigo-400 rounded-full hover:bg-indigo-600"
					>
						Post
					</button>
				</div>
			</div>
		</form>
	);
}
