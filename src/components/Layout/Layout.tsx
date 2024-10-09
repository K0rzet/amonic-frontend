import { ADMIN_PAGES } from "@/config/pages/admin.config";
import { useProfile } from "@/hooks/useProfile";
import React, { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useProfile();
  return (
    <div>
      <nav>
        {user.roleid === 1 && (
          <>
            <Link to={ADMIN_PAGES.DASHBOARD}>Dashboard</Link>
            <Link to={ADMIN_PAGES.SURVEY_STATS}>Survey Stats</Link>
            <Link to={ADMIN_PAGES.HOME}>Users</Link>
            <Link to={ADMIN_PAGES.AMENITIES_REPORTS}>Reports</Link>
            <Link to={ADMIN_PAGES.MANAGE_SCHEDULES}>Manage Schedules</Link>
            <Link to={ADMIN_PAGES.PURCHASE_AMENITIES}>Amenities</Link>
            <Link to={ADMIN_PAGES.SURVEY_STATS}>Survey stat</Link>
          </>
        )}
        <Link to={ADMIN_PAGES.SESSION_ERRORS}>Sessions</Link>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
