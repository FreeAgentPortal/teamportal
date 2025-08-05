"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./error.module.scss";
import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleTryAgain = () => {
    reset();
  };

  return (
    <PageLayout pages={[navigation().home.links.home]}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={styles.iconSection}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={styles.icon}>⚠️</div>
            <div className={styles.errorCode}>ERROR</div>
          </motion.div>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Something went wrong!
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The play broke down! We&apos;ve encountered an unexpected error. Our team has been notified and is working
            on a fix.
          </motion.p>

          {process.env.NODE_ENV === "development" && (
            <motion.div
              className={styles.errorDetails}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <details className={styles.detailsContainer}>
                <summary className={styles.detailsSummary}>View Error Details (Development Mode)</summary>
                <pre className={styles.errorMessage}>{error.message}</pre>
                {error.digest && <p className={styles.errorDigest}>Error ID: {error.digest}</p>}
              </details>
            </motion.div>
          )}

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.button
              className={styles.button}
              onClick={handleTryAgain}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>

            <motion.button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleGoHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Dashboard
            </motion.button>
          </motion.div>

          <motion.div
            className={styles.help}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className={styles.helpText}>If this problem persists, please contact our support team.</p>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
