import { useEffect, useState } from 'react';
import {
  Heading, Table, TableHead, TableRow, TableHeader, TableBody,
  TableCell, Select, SelectItem, Tile, Button, InlineNotification,
} from '@carbon/react';
import { Download } from '@carbon/icons-react';
import { logApi, processApi } from '../api/client';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [filterProcess, setFilterProcess] = useState('');
  const [error, setError] = useState('');

  const load = () => Promise.all([
    logApi.getAll().then(setLogs),
    processApi.getAll().then(setProcesses),
  ]).catch(() => setError('Loglar yüklenemedi'));

  useEffect(() => { load(); }, []);

  const filtered = filterProcess
    ? logs.filter(l => l.process?.id === parseInt(filterProcess))
    : logs;

  const exportLogs = () => {
    const data = JSON.stringify(filtered, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'aktivite-log.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Heading style={{ fontSize: '1.5rem' }}>Aktivite Logları</Heading>
        <Button kind="tertiary" onClick={exportLogs} renderIcon={Download}>Dışa Aktar</Button>
      </div>
      {error && <InlineNotification title="Hata" subtitle={error} kind="error" onClose={() => setError('')} />}
      <div style={{ marginBottom: '1rem', maxWidth: '300px' }}>
        <Select id="log-filter" labelText="Süreç Filtrele" value={filterProcess}
          onChange={e => setFilterProcess(e.target.value)}>
          <SelectItem value="" text="Tüm Süreçler" />
          {processes.map(p => (
            <SelectItem key={p.id} value={String(p.id)} text={p.name} />
          ))}
        </Select>
      </div>
      {filtered.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Tarih</TableHeader>
              <TableHeader>Aktör</TableHeader>
              <TableHeader>Aksiyon</TableHeader>
              <TableHeader>Detay</TableHeader>
              <TableHeader>Süreç</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(l => (
              <TableRow key={l.id}>
                <TableCell>{new Date(l.timestamp).toLocaleString('tr-TR')}</TableCell>
                <TableCell>{l.actor}</TableCell>
                <TableCell><code>{l.action}</code></TableCell>
                <TableCell>{l.details}</TableCell>
                <TableCell>{l.process?.name || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Tile style={{ padding: '3rem', textAlign: 'center', color: '#6f6f6f' }}>
          Henüz aktivite logu bulunmuyor.
        </Tile>
      )}
    </div>
  );
}
