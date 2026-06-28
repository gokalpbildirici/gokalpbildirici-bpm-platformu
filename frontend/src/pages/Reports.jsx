import { useEffect, useState } from 'react';
import { Heading, Tile, Grid, Column, Button, Select, SelectItem, InlineNotification } from '@carbon/react';
import { Download } from '@carbon/icons-react';
import { processApi, logApi } from '../api/client';

export default function Reports() {
  const [processes, setProcesses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      processApi.getAll().then(setProcesses),
      logApi.getAll().then(setLogs),
    ]).catch(() => setError('Veriler yüklenemedi'));
  }, []);

  const processLogs = selectedId
    ? logs.filter(l => l.process?.id === parseInt(selectedId))
    : logs;

  const totalLogs = processLogs.length;
  const uniqueActors = new Set(processLogs.map(l => l.actor)).size;

  const actionCounts = processLogs.reduce((acc, l) => {
    acc[l.action] = (acc[l.action] || 0) + 1;
    return acc;
  }, {});

  const mostCommonAction = Object.entries(actionCounts)
    .sort((a, b) => b[1] - a[1])[0];

  const exportPDF = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      processId: selectedId || 'all',
      metrics: {
        totalLogs, uniqueActors, mostCommonAction: mostCommonAction?.[0],
        mostCommonActionCount: mostCommonAction?.[1],
      },
      recentLogs: processLogs.slice(0, 20),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'performans-raporu.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Heading style={{ fontSize: '1.5rem' }}>Süreç Performans Raporları</Heading>
        <Button onClick={exportPDF} renderIcon={Download}>Raporu Dışa Aktar</Button>
      </div>
      {error && <InlineNotification title="Hata" subtitle={error} kind="error" onClose={() => setError('')} />}
      <div style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
        <Select id="report-process" labelText="Süreç Seç" value={selectedId}
          onChange={e => setSelectedId(e.target.value)}>
          <SelectItem value="" text="Tüm Süreçler" />
          {processes.map(p => (
            <SelectItem key={p.id} value={String(p.id)} text={p.name} />
          ))}
        </Select>
      </div>
      <Grid style={{ padding: 0, marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={2}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Heading style={{ fontSize: '2rem', color: '#0f62fe' }}>{totalLogs}</Heading>
            <p style={{ color: '#6f6f6f' }}>Toplam Aktivite</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={2}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Heading style={{ fontSize: '2rem', color: '#24a148' }}>{uniqueActors}</Heading>
            <p style={{ color: '#6f6f6f' }}>Farklı Aktör</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={2}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Heading style={{ fontSize: '2rem', color: '#fa4d56' }}>
              {mostCommonAction ? mostCommonAction[1] : 0}
            </Heading>
            <p style={{ color: '#6f6f6f' }}>En Sık Aksiyon</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={2}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Heading style={{ fontSize: '1rem', color: '#6f6f6f' }}>{mostCommonAction?.[0] || '-'}</Heading>
            <p style={{ color: '#6f6f6f' }}>En Sık Aksiyon Adı</p>
          </Tile>
        </Column>
      </Grid>
      <Tile style={{ padding: '1.5rem' }}>
        <Heading style={{ fontSize: '1rem', marginBottom: '1rem' }}>Aksiyon Dağılımı</Heading>
        {Object.entries(actionCounts).length > 0 ? (
          <div>
            {Object.entries(actionCounts).sort((a, b) => b[1] - a[1]).map(([action, count]) => (
              <div key={action} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '200px' }}><code>{action}</code></div>
                <div style={{
                  flex: 1, height: '24px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(count / totalLogs) * 100}%`, height: '100%',
                    backgroundColor: '#0f62fe', borderRadius: '4px', transition: 'width 0.3s',
                  }} />
                </div>
                <div style={{ width: '40px', textAlign: 'right', fontWeight: 600 }}>{count}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6f6f6f', textAlign: 'center' }}>Henüz veri bulunmuyor.</p>
        )}
      </Tile>
    </div>
  );
}
