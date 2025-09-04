'use client';

import { useEffect, useState } from 'react';
import { IoPlayCircleOutline } from 'react-icons/io5';
import styles from './VideoLink.module.scss';
import mql from '@microlink/mql'; // Import the Microlink SDK

const VideoLink = ({ videoUrl, index }: { videoUrl: string; index: number }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetaImage = async () => {
      if (!videoUrl) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await mql(videoUrl, {
          meta: true,
        });

        if (data.image) {
          setImageUrl(data.image.url);
        }
      } catch (error) {
        console.error('JSONLink API error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetaImage();
  }, [videoUrl]);

  const thumbnailStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#222',
  };

  return (
    <a href={videoUrl} target="_blank" key={index} className={styles.videoItem}>
      <div className={styles.videoThumbnail} style={imageUrl ? thumbnailStyle : { backgroundColor: '#222' }}>
        {!loading && imageUrl && <IoPlayCircleOutline className={styles.playIcon} />}
        {loading && <p className={styles.loadingText}>Loading...</p>}
      </div>
      <p className={styles.videoTitle}>Highlight Reel #{index + 1}</p>
    </a>
  );
};

export default VideoLink;
