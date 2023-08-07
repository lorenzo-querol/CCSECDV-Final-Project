'use client';

import { ACCEPTABLE_FILE_TYPES, MAX_LENGTH } from '@/constants';
import React, { useEffect, useState } from 'react';

import CreatePostForm from '@/app/components/CreatePostForm';
import Loading from '@/app/components/Loading';
import PostList from '@/app/components/PostList';
import ReportModal from '@/app/components/ReportModal';
import TimeOut from '@/app/components/Timeout';
import sanitizeHtml from 'sanitize-html';
import { useSession } from 'next-auth/react';

export default function Home() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState(null);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [imageError, setImageError] = useState('');

    // Submission states
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [remainingCharacters, setRemainingCharacters] = useState(MAX_LENGTH);
    const [handleButton, setHandleButton] = useState(true);

    // Report states
    const [reportReason, setReportReason] = useState('');
    const [reportInfo, setReportInfo] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isCooldown, setCooldown] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`/api/posts`);
            const { data } = await res.json();
            setPosts(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const isCurrentlyCooldown = async () => {
        try {
            const res = await fetch(`/api/users/${session.user.user_id}`);
            const { data } = await res.json();
            if (data.status == 'approved') setCooldown(true);
            else setCooldown(false);
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

            const likedPosts = new Set(data.map(post => post.post_id));
            setLikedPosts(likedPosts);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleTextChange = event => {
        const inputText = sanitizeHtml(event.target.value.trim());
        const charCount = inputText.length;
        if (charCount === 0 || charCount > MAX_LENGTH) {
            setHandleButton(true);
        } else {
            setHandleButton(false);
            setImageError('');
        }
        setRemainingCharacters(MAX_LENGTH - charCount);
        setText(inputText);
    };

    const handleImageChange = event => {
        const file = event.target.files[0];
        if (!file) return;

        if (!ACCEPTABLE_FILE_TYPES.includes(file.type)) {
            setImageError('Invalid File Type');
            setImage(null);
            setHandleButton(true);
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = event => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const description = sanitizeHtml(event.target.elements['post-textarea'].value);

        try {
            //Check if submissiion is valid
            if (description.length === 0 || description.length > MAX_LENGTH) throw new Error('Invalid submission.');

            const formData = new FormData();
            formData.append('image', image);
            formData.append(
                'postInfo',
                JSON.stringify({
                    description: description,
                    avatar: session.user.avatar,
                    user_id: session.user.user_id,
                    name: session.user.name,
                    image: image,
                }),
            );
            const res = await fetch(`/api/posts`, {
                method: 'POST',
                body: formData,
            });

            const { ok } = await res.json();
            if (!ok) throw new Error('Error creating post');

            // Reset state of submission box
            event.target.reset();
            setImage(null);
            setImagePreview(null);
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
                method: 'PUT',
                body: JSON.stringify({ heart_count: heartCount }),
            });

            const userPromise = fetch(`/api/users/${session.user.user_id}/liked-posts/${postId}`, {
                method: heartCount === 1 ? 'POST' : 'DELETE',
            });

            const [post, user] = await Promise.all([postPromise, userPromise]);
            const { ok: postOk } = await post.json();
            const { ok: userOk } = await user.json();
            if (!postOk && !userOk) throw new Error('Error liking post');

            await fetchPosts();
            await getLikedPosts();
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDelete = async postId => {
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });
            const { ok } = await res.json();
            if (!ok) throw new Error('Error deleting post.');

            await fetchPosts();
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleShowReportModal = event => {
        event.preventDefault();
        setShowReportModal(!showReportModal);
    };

    const handleReportReasonChange = event => {
        setReportReason(event.target.value);
    };

    const handlePostClicked = (event, post) => {
        event.preventDefault();

        setReportInfo({
            user_id: post.user_id,
            post_id: post.post_id,
            name: post.name,
        });
    };

    const handleSubmitReport = async event => {
        event.preventDefault();

        try {
            const report = {
                ...reportInfo,
                description: reportReason,
                status: 'pending',
            };

            const res = await fetch(`/api/reports`, {
                method: 'POST',
                body: JSON.stringify(report),
            });
            const { ok } = await res.json();
            if (!ok) throw new Error('Error reporting post.');

            setShowReportModal(false);
            setReportReason('');
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (session) {
            isCurrentlyCooldown();
            fetchPosts();
            getLikedPosts();
        }
    }, [session]);

    if (status === 'loading') return <Loading />;

    if (isCooldown) return <TimeOut />;

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
                        image={imagePreview}
                        user={session.user}
                        handleTextChange={handleTextChange}
                        imageError={imageError}
                        remainingCharacters={remainingCharacters}
                        handleImageChange={handleImageChange}
                        handleRemoveImage={handleRemoveImage}
                        handleButton={handleButton}
                    />
                    {posts && (
                        <PostList
                            posts={posts}
                            likedPosts={likedPosts}
                            user={session.user}
                            handleLike={handleLike}
                            handleDelete={handleDelete}
                            handleShowReportModal={handleShowReportModal}
                            handlePostClicked={handlePostClicked}
                        />
                    )}
                </div>

                {/* right menu */}
                <div className="w-fit">
                    <div className="relative w-full p-5 mr-16 text-gray-300"></div>
                </div>
            </div>

            {showReportModal && (
                <ReportModal
                    reportReason={reportReason}
                    handleShowReportModal={handleShowReportModal}
                    handleReportReasonChange={handleReportReasonChange}
                    handleSubmitReport={handleSubmitReport}
                />
            )}
        </>
    );
}
