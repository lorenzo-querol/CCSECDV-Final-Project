import Post from "./Post";

export default function PostList({
	posts,
	likedPosts,
	user,
	handleLike,
	handleDelete,
	handleShowReportModal,
	handlePostClicked,
}) {
	return (
		<ul className="list-none h-72">
			{posts.map((post, index) => (
				<Post
					key={index}
					post={post}
					isLiked={likedPosts.has(post.post_id)}
					isOwnPost={user.user_id === post.user_id}
					handleDelete={handleDelete}
					handleLike={handleLike}
					handleShowReportModal={handleShowReportModal}
					handlePostClicked={handlePostClicked}
				/>
			))}
		</ul>
	);
}
