import {
  BellIcon,
  GearIcon,
  SyncIcon,
  XCircleIcon,
} from '@primer/octicons-react';
import { ipcRenderer } from 'electron';
import React, { useCallback, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getNotificationCount } from '../utils/notifications';
import { Logo } from '../components/Logo';
import { AppContext } from '../context/App';
import { Constants } from '../utils/constants';
import { openExternalLink } from '../utils/comms';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn } = useContext(AppContext);
  const { notifications, fetchNotifications, isFetching } =
    useContext(AppContext);

  const onOpenBrowser = useCallback(() => {
    openExternalLink(`https://github.com/${Constants.REPO_SLUG}`);
  }, []);

  const onOpenGitHubNotifications = useCallback(() => {
    openExternalLink(`https://github.com/notifications`);
  }, []);

  const quitApp = useCallback(() => {
    ipcRenderer.send('app-quit');
  }, []);

  const notificationsCount = useMemo(() => {
    return getNotificationCount(notifications);
  }, [notifications]);

  const sidebarButtonClasses =
    'flex justify-evenly items-center bg-transparent border-0 w-full text-sm text-white my-1 py-2 cursor-pointer hover:text-gray-500 focus:outline-none disabled:text-gray-500 disabled:cursor-default';

  return (
    <div className="flex flex-col fixed left-14 w-14 -ml-14 h-full bg-gray-sidebar overflow-y-auto">
      <div className="flex flex-col flex-1 items-center py-4">
        <button
          className="w-5 my-3 mx-auto cursor-pointer outline-none"
          title="Open Gitify on GitHub"
          onClick={onOpenBrowser}
          data-testid="gitify-logo"
        >
          <Logo aria-label="Open Gitify" />
        </button>

        <button
          className={`flex justify-around self-stretch items-center my-1 py-1 px-2 text-xs font-extrabold cursor-pointer ${
            notificationsCount > 0 ? 'text-green-500' : 'text-white'
          }`}
          onClick={onOpenGitHubNotifications}
          title={`${notificationsCount} Unread Notifications`}
        >
          <BellIcon
            size={12}
            aria-label={`${notificationsCount} Unread Notifications`}
          />
          {notificationsCount > 0 && notificationsCount}
        </button>
      </div>

      <div className="py-4 px-3">
        {isLoggedIn && (
          <>
            <button
              className={sidebarButtonClasses}
              title="Refresh Notifications"
              onClick={() => {
                navigate('/', { replace: true });
                fetchNotifications();
              }}
              disabled={isFetching}
            >
              <SyncIcon
                size={16}
                aria-label="Refresh Notifications"
                className={isFetching ? 'animate-spin' : undefined}
              />
            </button>

            <button
              className={sidebarButtonClasses}
              title="Settings"
              onClick={() => {
                if (location.pathname.startsWith('/settings')) {
                  navigate('/', { replace: true });
                } else {
                  navigate('/settings');
                }
              }}
            >
              <GearIcon size={16} aria-label="Settings" />
            </button>
          </>
        )}

        {!isLoggedIn && (
          <button
            className={sidebarButtonClasses}
            title="Quit Gitify"
            aria-label="Quit Gitify"
            onClick={quitApp}
          >
            <XCircleIcon size={16} aria-label="Quit Gitify" />
          </button>
        )}
      </div>
    </div>
  );
};
