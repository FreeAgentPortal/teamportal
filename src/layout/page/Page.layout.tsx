'use client';
import React, { Suspense } from 'react';
import BlockedMessage from '@/components/blockedMessage/BlockedMessage.component';
import { useUser } from '@/state/auth';
import { FEATURES, hasFeature } from '@/utils/hasFeature';
import Auth from '@/views/auth/Auth.view';
import { ReactNode } from 'react';
import { AiFillControl } from 'react-icons/ai';
import Control, { ControlNavItem } from '../control/Control.layout';
import Header from '../header/Header.layout';
import SideBar from '../sideBar/SideBar.layout';
import styles from './Page.module.scss';
import NextTopLoader from 'nextjs-toploader';
import { useLayoutStore } from '@/state/layout';
import AlertCenter from '../alertCenter/AlertCenter.layout';
import { LoaderProvider } from '../progressBar/LoaderProvider.component';

//make a type with children as a prop
type Props = {
  children: React.ReactNode;
  pages?: Array<{ title: string; link?: string; icon?: ReactNode; onClick?: () => void }>;
  largeSideBar?: boolean;
  backgroundColor?: string;
  hideControlLayout?: boolean;
  controlNav?: Array<ControlNavItem>;
  neededFeature?: any;
  enableBlockCheck?: boolean;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    url?: string;
    image?: string;
  };
  sidebarHidden?: boolean;
};
const PageLayout = (props: Props) => {
  const sideBarOpen = useLayoutStore((state) => state.sideBarOpen);
  const controlLayoutOpen = useLayoutStore((state) => state.controlLayoutOpen);
  const toggleControlLayout = useLayoutStore((state) => state.toggleControlLayout);

  const { data: loggedInData } = useUser();
  const getPageBlockData: () => boolean | 'blacklist' | 'feature' | 'verification' = () => {
    if (!props.enableBlockCheck) return false;
    if (loggedInData?.isBlacklisted) {
      return 'blacklist';
    }

    if (!loggedInData?.isEmailVerified) {
      return 'verification';
    }

    if (props.neededFeature) {
      if (!hasFeature(loggedInData, props.neededFeature)) {
        return 'feature';
      }
    }

    return false as boolean;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={`${styles.container} ${props.largeSideBar ? '' : styles.small} ${sideBarOpen && styles.sideBarActive}`}>
        {loggedInData ? (
          <>
            <Header pages={props.pages} />
            {!props.sidebarHidden && <div className={styles.sideBar}>{props?.pages && <SideBar page={props.pages[0]} large={props.largeSideBar} />}</div>}
            <div
              className={`${styles.content} ${controlLayoutOpen && !getPageBlockData() && styles.controlContainerActive} ${
                props.controlNav && !getPageBlockData() && !props.hideControlLayout && styles.controlBarActive
              }`}
              style={{
                backgroundColor: props.backgroundColor,
              }}
            >
              {props.controlNav && !getPageBlockData() && !props.hideControlLayout && (
                <>
                  <div className={styles.controlContainer}>
                    <Control navigation={props.controlNav} />
                  </div>

                  <div className={styles.controlToggleBtn} onClick={() => toggleControlLayout()}>
                    <AiFillControl />
                  </div>
                </>
              )}

              <div className={styles.childrenWrapper}>
                <div className={styles.childrenContainer}>
                  {getPageBlockData() ? (
                    <BlockedMessage neededFeature={props.neededFeature} type={getPageBlockData() as any} />
                  ) : (
                    <>
                      <NextTopLoader
                        color="var(--primary)"
                        initialPosition={0.08}
                        crawlSpeed={200}
                        height={3}
                        crawl={true}
                        showSpinner={false}
                        easing="ease"
                        speed={200}
                        shadow="0 0 10px var(--primary-dark),0 0 5px var(--primary)"
                        showForHashAnchor
                      />

                      <AlertCenter />
                      <LoaderProvider>{props.children}</LoaderProvider>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Auth />
        )}
      </div>
    </Suspense>
  );
};
export default PageLayout;
