"use client";

import React, { useEffect, useState } from "react";

import CreatePostForm from "@/app/components/CreatePostForm";
import Loading from "@/app/components/Loading"
import PostList from "@/app/components/PostList";
import ReportModal from "@/app/components/ReportModal";
import sanitizeHtml from "sanitize-html";
import { useSession } from "next-auth/react";
import { RestoreRequestFilterSensitiveLog } from "@aws-sdk/client-s3";

const MAX_LENGTH = 180;

export default function Home() {
	const { data: session, status } = useSession();
	const [posts, setPosts] = useState(null);
	const [likedPosts, setLikedPosts] = useState(new Set());
    const [imageError, setImageError] = useState("");
	// Submission states
	const [text, setText] = useState("");
	const [image, setImage] = useState(null);
	const [remainingCharacters, setRemainingCharacters] = useState(MAX_LENGTH);

	// TODO Report modal states (WIP)
	const [showReportModal, setShowReportModal] = useState(false);
	const [reportReason, setReportReason] = useState("");

	const fetchPosts = async () => {
		try {
			const res = await fetch(`/api/posts`);
			const { data } = await res.json();
			setPosts(data);
		} catch (error) {
			console.log(error.message);
		}
	};

	const getLikedPosts = async () => {
		try {
			const res = await fetch(`/api/users/${session.user.user_id}/liked-posts`);
			const { data } = await res.json();
			if (!data) {
				setLikedPosts(new Set());
				return;
			}

			const likedPosts = new Set(data.map((post) => post.post_id));
			setLikedPosts(likedPosts);
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleTextChange = (event) => {
		const inputText = event.target.value;
		const charCount = inputText.length;

		setRemainingCharacters(MAX_LENGTH - charCount);
		setText(inputText);
	};
    function isFileTypeEncoded(str) {
        const target = "data:image/"
        const validImageTypes = ['jpeg', 'jpg', 'png', 'svg'];
        if (str != null || str != undefined) {
            for (let imageType of validImageTypes) {
                if (str.startsWith(target + imageType) || str.startsWith(target + imageType.toUpperCase))  
                    setImageError("")
                    return true 
            }
        }
        setImageError("Invalid File Type")
        return false 
      }
	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (!file) {
            return ;
        }
        const validImageTypes = ['jpeg', 'jpg', 'png', 'svg'];
        for (let imageType of validImageTypes) {
            if (file.name.endsWith(imageType)) {
                const reader = new FileReader();
                reader.onloadend = () => setImage(reader.result);
                reader.readAsDataURL(file);
                setImageError("")
                return ;
            }  
        }
            setImageError("Invalid File Type")
	};

	const handleRemoveImage = () => setImage(null);
   
	const handleSubmit = async (event) => {
		event.preventDefault();
        
		const description = sanitizeHtml(
			event.target.elements["post-textarea"].value,
		);
		try {
			if ((description.length === 0 && image === null) || (description != "" && description.length > 180) || (image != null && !isFileTypeEncoded(image)))
				throw new Error("Invalid Submission");
			const res = await fetch(`/api/posts`, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				method: "POST",
				body: JSON.stringify({
					description: description,
					avatar: session.user.avatar,
					user_id: session.user.user_id,
					name: session.user.name,
					image: image,
				}),
			});

			const { ok } = await res.json();
			if (!ok) throw new Error("Error creating post.");

			// Reset state of submission box
			event.target.reset();
			setImage(null);
			setRemainingCharacters(MAX_LENGTH);

			await fetchPosts();
			await getLikedPosts();
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleLike = async (event, postId) => {
		event.preventDefault();

		const newLikedPosts = new Set(likedPosts);
		if (likedPosts.has(postId)) newLikedPosts.delete(postId);
		else newLikedPosts.add(postId);
		setLikedPosts(newLikedPosts);

		const heartCount = likedPosts.has(postId) ? -1 : 1;

		try {
			const postPromise = fetch(`/api/posts/${postId}`, {
				method: "PUT",
				body: JSON.stringify({ heart_count: heartCount }),
			});

			const userPromise = fetch(
				`/api/users/${session.user.user_id}/liked-posts/${postId}`,
				{
					method: heartCount === 1 ? "POST" : "DELETE",
				},
			);

			const [post, user] = await Promise.all([postPromise, userPromise]);
			const { ok: postOk } = await post.json();
			const { ok: userOk } = await user.json();
			if (!postOk && !userOk) throw new Error("Error liking post");

			await fetchPosts();
			await getLikedPosts();
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDelete = async (postId) => {
		try {
			const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
			const { ok } = await res.json();
			if (!ok) throw new Error("Error deleting post.");

			await fetchPosts();
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		if (session) {
			fetchPosts();
			getLikedPosts();
		}
	}, [session]);

	if (status === "loading") return <Loading />;
	if (!posts || !likedPosts) return <Loading />;

	return (
		<>
			<div className="flex flex-row h-full overflow-y-auto">
				{/* Middle */}
				<div className="w-4/6 h-full border-t-0 border-gray-600 border-x-2">
					<div className="flex">
						<div className="flex-1 m-2">
							<h2 className="px-4 py-2 text-2xl font-bold text-white">Home</h2>
						</div>
					</div>
					<hr className="border-gray-600" />

					{/* Create posts */}
					<hr className="border-4 border-indigo-800" />
					<div></div>

					<CreatePostForm
						handleSubmit={handleSubmit}
						image={image}
						user={session.user}
						handleTextChange={handleTextChange}
                        imageError={imageError}
						remainingCharacters={remainingCharacters}
						handleImageChange={handleImageChange}
						handleRemoveImage={handleRemoveImage}
					/>
					<PostList
						posts={posts}
						likedPosts={likedPosts}
						user={session.user}
						handleLike={handleLike}
						handleDelete={handleDelete}
					/>
				</div>

				{/* right menu */}
				<div className="w-fit">
					<div className="relative w-full p-5 mr-16 text-gray-300"></div>
				</div>
			</div>

			{showReportModal && <ReportModal />}
		</>
	);
}
