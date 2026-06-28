import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tile, ClickableTile, Grid, Column, Heading, SkeletonText } from '@carbon/react';
import { Document, Flow, UserRole, Rule, CloudAuditing, Report, Version } from '@carbon/icons-react';
import { processApi, roleApi, ruleApi, logApi } from '../api/client';

const statsCards = [
  { key: 'processes', icon: Flow, label: 'Toplam Süreç', color: '#0f62fe' },
  { key: 'roles', icon: UserRole, label: 'Roller', color: '#6f6f6f' },
  { key: 'rules', icon: Rule, label: 'İş Kuralları', color: '#24a148' },
  { key: 'logs', icon: CloudAuditing, label: 'Aktivite Logları', color: '#fa4d56' },
];

const quickLinks = [
  { icon: Flow, label: 'Süreç Yönetimi', path: '/processes' },
  { icon: Flow, label: 'Süreç Haritalama', path: '/mapping' },
  { icon: Version, label: 'Versiyonlama', path: '/versions' },
  { icon: Document, label: 'Raporlar', path: '/reports' },
];

function StatCard({ count, icon: Icon, label, color }) {
  return (
    <Column lg={4} md={4} sm={2}>
      <Tile style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: `${color}20` }}>
            <Icon size={24} style={{ color }} />
          </div>
          <div>
            <Heading style={{ fontSize: '2rem', fontWeight: 600 }}>{count ?? <SkeletonText />}</Heading>
            <p style={{ color: '#6f6f6f' }}>{label}</p>
          </div>
        </div>
      </Tile>
    </Column>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      processApi.getAll().then(d => ({ processes: d.length })),
      roleApi.getAll().then(d => ({ roles: d.length })),
      ruleApi.getAll().then(d => ({ rules: d.length })),
      logApi.getAll().then(d => ({ logs: d.length })),
    ]).then(results => setStats(Object.assign({}, ...results)));
  }, []);

  return (
    <div>
      <Heading style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>BPM Dokümantasyon Platformu</Heading>
      <Grid style={{ padding: 0, marginBottom: '2rem' }}>
        {statsCards.map(card => (
          <StatCard key={card.key} count={stats[card.key]} {...card} />
        ))}
      </Grid>
      <Heading style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Hızlı Erişim</Heading>
      <Grid style={{ padding: 0 }}>
        {quickLinks.map(link => (
          <Column key={link.path} lg={4} md={4} sm={2}>
            <ClickableTile onClick={() => navigate(link.path)} style={{ padding: '1.5rem', textAlign: 'center' }}>
              <link.icon size={32} style={{ marginBottom: '0.5rem' }} />
              <p>{link.label}</p>
            </ClickableTile>
          </Column>
        ))}
      </Grid>
    </div>
  );
}
