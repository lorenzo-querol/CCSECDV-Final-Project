'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import PostList from '@/app/components/PostList';
import Loading from '@/app/components/Loading';
import { useSession } from 'next-auth/react';
import TimeOut from '@/app/components/Timeout';

export default function Profile() {
    const { data: session, status } = useSession();
    const [currentTab, setCurrentTab] = useState('posts');
    const [posts, setPosts] = useState(null);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [isCooldown, setCooldown] = useState(false);
    // TODO Report modal states (WIP)
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');

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

            if (data.reports != null || (data.reports != undefined && data.status == 'approved')) {
                if (Object.keys(data.reports).length && data.status == 'approved') setCooldown(true);
                else setCooldown(false);
            } else setCooldown(false);
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
            const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
            const { ok } = await res.json();
            if (!ok) throw new Error('Error deleting post.');

            await fetchPosts();
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
    else if (isCooldown) return <TimeOut />;
    else if (!posts || !likedPosts) return <Loading />;
    else
        return (
            <div className="flex flex-row h-full overflow-y-auto">
                {/* Middle */}
                <div className="w-4/6 h-full border-t-0 border-gray-600 border-x-2">
                    <div className="flex">
                        <div className="flex-1 m-2">
                            <h2 className="px-4 py-2 text-2xl font-bold text-white">Profile</h2>
                        </div>
                    </div>
                    <hr className="border-gray-600" />

                    {/* Profile info */}
                    <div className="flex flex-1 w-full p-2">
                        {/* Image */}
                        <div>
                            <div className="relative rounded-full md avatar w-36 h-36">
                                <Image
                                    className="relative border-4 border-gray-900 rounded-full w-36 h-36 md"
                                    src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${session.user.avatar}`}
                                    alt=""
                                    priority={true}
                                    placeholder="empty"
                                    style={{ objectFit: 'cover' }}
                                    width={144}
                                    height={144}
                                />
                                <div className="absolute"></div>
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <div className="flex flex-col items-start justify-end w-full h-full ml-3 space-y-2">
                                <h2 className="text-2xl font-bold leading-6 text-white">{session.user.name}</h2>
                                <p className="text-base font-medium leading-5 text-gray-600">{session.user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between w-full h-10">
                        <button
                            className={`w-1/2 text-xl font-bold hover:bg-indigo-700 ${
                                currentTab === 'posts' ? 'bg-indigo-700' : ''
                            }`}
                            onClick={() => setCurrentTab('posts')}
                        >
                            Posts
                        </button>
                        <button
                            className={`w-1/2 text-xl font-bold hover:bg-indigo-700 ${
                                currentTab === 'likes' ? 'bg-indigo-700' : ''
                            }`}
                            onClick={() => setCurrentTab('likes')}
                        >
                            Likes
                        </button>
                    </div>

                    <hr className="border-4 border-indigo-800" />

                    {currentTab === 'posts' ? (
                        <PostList
                            posts={posts.filter(post => post.user_id === session.user.user_id)}
                            likedPosts={likedPosts}
                            user={session.user}
                            handleLike={handleLike}
                            handleDelete={handleDelete}
                        />
                    ) : (
                        <PostList
                            posts={posts.filter(post => likedPosts.has(post.post_id))}
                            likedPosts={likedPosts}
                            user={session.user}
                            handleLike={handleLike}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
                {/* right menu */}
                <div className="w-fit">
                    <div className="relative w-full p-5 mr-16 text-gray-300"></div>
                </div>
            </div>
        );
}
