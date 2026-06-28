import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Content, Header, HeaderName, HeaderNavigation, HeaderMenuItem,
  SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem,
  Grid, Column,
} from '@carbon/react';
import {
  Dashboard, Document, Flow, Version, UserRole, Rule, CloudAuditing, Report, DataTable,
} from '@carbon/icons-react';
import DashboardPage from './pages/Dashboard';
import ProcessList from './pages/ProcessList';
import ProcessDetail from './pages/ProcessDetail';
import ProcessMapping from './pages/ProcessMapping';
import Versioning from './pages/Versioning';
import Roles from './pages/Roles';
import BusinessRules from './pages/BusinessRules';
import ActivityLogs from './pages/ActivityLogs';
import Reports from './pages/Reports';

const navItems = [
  { icon: Dashboard, label: 'Panel', path: '/' },
  { icon: Flow, label: 'Süreçler', path: '/processes' },
  { icon: Flow, label: 'Süreç Haritalama', path: '/mapping' },
  { icon: Version, label: 'Versiyonlama', path: '/versions' },
  { icon: UserRole, label: 'Roller', path: '/roles' },
  { icon: Rule, label: 'İş Kuralları', path: '/rules' },
  { icon: CloudAuditing, label: 'Aktivite Logları', path: '/logs' },
  { icon: Report, label: 'Raporlar', path: '/reports' },
];

function Shell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSideNavExpanded, setSideNavExpanded] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header aria-label="BPM Platform">
        <HeaderName href="#" prefix="BPM">
          Dokümantasyon Platformu
        </HeaderName>
        <HeaderNavigation aria-label="BPM">
          {navItems.map(item => (
            <HeaderMenuItem key={item.path} onClick={() => navigate(item.path)} isActive={location.pathname === item.path}>
              {item.label}
            </HeaderMenuItem>
          ))}
        </HeaderNavigation>
      </Header>
      <SideNav
        isPersistent
        isSideNavExpanded={isSideNavExpanded}
        onSideNavBlur={() => setSideNavExpanded(false)}
      >
        <SideNavItems>
          {navItems.map(item => (
            <SideNavLink
              key={item.path}
              renderIcon={item.icon}
              onClick={() => navigate(item.path)}
              isActive={location.pathname === item.path}
            >
              {item.label}
            </SideNavLink>
          ))}
        </SideNavItems>
      </SideNav>
      <Content style={{ marginLeft: isSideNavExpanded ? '16rem' : '3rem', padding: '2rem', flex: 1 }}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/processes" element={<ProcessList />} />
              <Route path="/processes/:id" element={<ProcessDetail />} />
              <Route path="/mapping" element={<ProcessMapping />} />
              <Route path="/versions" element={<Versioning />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/rules" element={<BusinessRules />} />
              <Route path="/logs" element={<ActivityLogs />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Column>
        </Grid>
      </Content>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
