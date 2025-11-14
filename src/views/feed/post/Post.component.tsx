'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { BiComment } from 'react-icons/bi';
import { Dropdown, Modal } from 'antd';
import { MoreOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post as PostType } from '@/types/ISocialPost';
import { renderPostContent } from '../utils/renderPostContent';
import { usePostView } from '../hooks/usePostView';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';
import { useInterfaceStore } from '@/state/interface';
import axios from '@/utils/axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './Post.module.scss';
import ReactionSummary from '../components/reactionSummary/ReactionSummary.component';
import ReactionButton from '../components/reactionButton/ReactionButton.component';

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {
  dayjs.extend(relativeTime);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { selectedProfile } = useSelectedProfile();
  const addAlert = useInterfaceStore((state) => state.addAlert);

  // Track post views - returns a callback ref
  const containerRef = usePostView({ postId: post._id, threshold: 5000 });

  // Get interaction data from backend
  const interactions = (post as any)?.interactions;

  const profile = (post?.objectDetails as any)?.profile;
  const profileImageUrl = profile?.profileImageUrl;
  const authorName = profile?.fullName;

  // Check if current user is the post owner
  // Parse authorId format: "user:688025c6746c88cf383f61e0;profile:689de192258d32dd996d6726"
  const getProfileIdFromAuthorId = (authorId: string): string | null => {
    const profilePart = authorId.split(';').find((part) => part.startsWith('profile:'));
    return profilePart ? profilePart.replace('profile:', '') : null;
  };

  const postProfileId = post.actorId ? getProfileIdFromAuthorId(post.actorId) : null;
  const currentUserProfileId = selectedProfile?._id;
  const isOwner = postProfileId && currentUserProfileId && postProfileId === currentUserProfileId;

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await axios.delete(`/feed/activity/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addAlert({ message: 'Post deleted successfully', type: 'success' });
      setIsDeleting(false);
    },
    onError: (error: any) => {
      addAlert({ message: error?.response?.data?.message || 'Failed to delete post', type: 'error' });
      setIsDeleting(false);
    },
  });

  const handleDeleteClick = () => {
    Modal.confirm({
      title: 'Delete Post',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this post? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setIsDeleting(true);
        deleteMutation.mutate(post._id);
      },
    });
  };

  const menuItems = [
    {
      key: 'delete',
      label: 'Remove Post',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDeleteClick,
    },
  ];

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Post Header */}
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            {profileImageUrl ? (
              <Image src={profileImageUrl} alt={authorName} width={40} height={40} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>{authorName?.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>{authorName}</span>
            <span className={styles.timestamp}>{dayjs(post?.createdAt).fromNow()}</span>
          </div>
        </div>
        <div className={styles.actions}>
          {isOwner && (
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <button className={styles.menuButton} disabled={isDeleting}>
                <MoreOutlined style={{ fontSize: '20px' }} />
              </button>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Post Content - Dynamic based on type */}
      <div className={styles.content}>{renderPostContent({ post: post as any, mode: 'feed', postId: post._id })}</div>

      {/* Reaction Summary */}
      <ReactionSummary reactionBreakdown={interactions?.reactionBreakdown} totalReactions={interactions?.counts?.reactions || 0} viewCount={interactions?.counts?.views || 0} />

      {/* Post Footer */}
      <div className={styles.footer}>
        <ReactionButton
          postId={post._id}
          reactionCount={interactions?.counts?.reactions || 0}
          hasReacted={interactions?.userInteraction?.hasReacted || false}
          userReactionType={interactions?.userInteraction?.reactionType}
          reactionBreakdown={interactions?.reactionBreakdown}
        />
        <button className={styles.interactionButton} disabled>
          <BiComment size={18} />
          <span>Comment</span>
          {interactions?.counts?.comments > 0 && <span className={styles.count}>({interactions.counts.comments})</span>}
        </button>
      </div>
    </div>
  );
};

export default Post;
