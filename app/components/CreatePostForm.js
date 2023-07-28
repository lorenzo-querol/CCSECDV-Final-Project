import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";

import { BiImage } from "react-icons/bi";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import { useSession } from "next-auth/react";
import { useState } from "react";

const MAX_LENGTH = 180;

export default function CreatePostForm() {
    const { data: session } = useSession();
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [remainingCharacters, setRemainingCharacters] = useState(MAX_LENGTH);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => setImagePreview(null);

    const handleTextChange = (event) => {
        const inputText = event.target.value;
        const charCount = inputText.length;

        setRemainingCharacters(MAX_LENGTH - charCount);
        setText(inputText);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const postText = sanitizeHtml(
            event.target.elements["post-textarea"].value
        );

        try {
            if (postText.length > 180 || imagePreview)
                throw new Error("Invalid Submission Text");

            const res = await fetch(`/api/posts`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                method: "POST",
                body: JSON.stringify({
                    description: postText,
                    avatar: session.user.avatar,
                    user_id: session.user.user_id,
                    name: session.user.name,
                    image: imagePreview,
                }),
            });

            const { data } = await res.json();
            event.target.reset();
            setRemainingCharacters(MAX_LENGTH);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex py-2">
                <div className="w-10 py-1 m-2">
                    <Image
                        className="inline-block w-10 h-10 rounded-full"
                        src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${session.user.avatar}`}
                        style={{
                            objectFit: "cover",
                        }}
                        width={40}
                        height={40}
                        alt=""
                    />
                </div>
                <div className="flex-1 px-2 pt-2 mt-2">
                    <textarea
                        className="w-full text-lg font-medium text-gray-400 bg-transparent p-2"
                        rows="2"
                        cols="50"
                        name="post-textarea"
                        placeholder="What's happening?"
                        onChange={handleTextChange}
                    ></textarea>
                    <div className="flex justify-center">
                        {remainingCharacters < 0 ? (
                            <p className="items-center font-semibold text-red-500">
                                {" "}
                                Maximum character count exceeded ({
                                    MAX_LENGTH
                                }).{" "}
                            </p>
                        ) : (
                            <p className="items-center font-semibold text-gray-500">
                                {remainingCharacters}/{MAX_LENGTH}
                            </p>
                        )}
                    </div>
                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="relative mt-2">
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-0 right-0 p-2 text-red-500"
                            >
                                <AiFillCloseCircle size={25} />
                            </button>
                            <Image
                                src={imagePreview}
                                alt="Image Preview"
                                className="w-full max-h-64"
                                width={500}
                                height={500}
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
                    </div>
                </div>

                {/* Post Button */}
                <div className="flex-1">
                    <button
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
