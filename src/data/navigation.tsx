import { RiHome2Fill } from 'react-icons/ri';
import { MdSupportAgent } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { BsBox, BsBroadcastPin } from 'react-icons/bs';
import { BsFillPeopleFill } from 'react-icons/bs';
import { IoCodeSlashOutline } from 'react-icons/io5';
import { profile } from 'console';

export const navigation = (options?: any) => {
  return {
    home: {
      title: 'Home',
      links: {
        home: {
          title: 'Home',
          link: '/',
          icon: <RiHome2Fill />,
        },
        feed: {
          title: 'Feed',
          link: '/feed',
          icon: <BsBroadcastPin />,
        },
        notifications: {
          title: 'Notifications',
          link: '/notifications',
          icon: <FaRegBell />,
        },
      },
      hidden: options?.user ? false : true,
    },
    opportunities_hub: {
      title: 'Opportunities Hub',
      links: {
        search_preferences: {
          title: 'Dynamic Search Hub',
          link: '/opportunities_hub/search_preferences',
          icon: <BsFillPeopleFill />,
        },
        //TODO: add the ability to create a badge to wrap the icon to show how many new
        // reports there are
        reports: {
          title: 'Reports',
          link: '/opportunities_hub/reports',
          icon: <BsBox />,
        },
        athletes: {
          title: 'Athletes',
          link: '/opportunities_hub/athletes',
          icon: <BsFillPeopleFill />,
        },
      },
    },
    account_details: {
      title: 'Account Details',
      links: {
        profile: {
          title: 'Profile',
          link: '/account_details/profile',
          icon: <BsFillPeopleFill />,
        },
        account_details: {
          title: 'Edit Account Settings',
          link: '/account_details',
          icon: <CgProfile />,
        },
        keys: {
          title: 'API Keys',
          link: '/account_details/keys',
          icon: <IoCodeSlashOutline />,
          hidden: true,
        },
        support: {
          title: 'Support',
          link: '/account_details/support',
          icon: <MdSupportAgent />,
        },
      },
      hidden: options?.user ? false : true,
    },

    billing: {
      title: 'Billing',
      links: {
        account_center: {
          title: 'Billing Account Center',
          link: '/billing',
          icon: <BsBox />,
        },
      },
      hidden: true,
    }, // error and 404 boundary, always hidden but something for the page layout to point to
    error_boundary: {
      title: 'Error Boundary',
      links: {
        not_found: {
          title: 'Not Found',
          link: '/404',
          icon: <BsBroadcastPin />,
        },
        error: {
          title: 'Error',
          link: '/error',
          icon: <BsBroadcastPin />,
        },
      },
      hidden: true,
    },
  };
};
