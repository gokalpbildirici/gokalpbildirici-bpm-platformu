import { useEffect, useState } from 'react';
import {
  Heading, Select, SelectItem, Tile, Button, Modal, TextInput, TextArea,
  Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Tag, InlineNotification,
} from '@carbon/react';
import { Restart, Download } from '@carbon/icons-react';
import { processApi } from '../api/client';

export default function Versioning() {
  const [processes, setProcesses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [versions, setVersions] = useState([]);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [changedBy, setChangedBy] = useState('');
  const [changeDesc, setChangeDesc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    processApi.getAll().then(setProcesses).catch(() => setError('Süreçler yüklenemedi'));
  }, []);

  useEffect(() => {
    if (!selectedId) { setVersions([]); return; }
    processApi.getVersions(selectedId).then(setVersions).catch(() => setError('Versiyonlar yüklenemedi'));
  }, [selectedId]);

  const handleCreateVersion = async () => {
    if (!changedBy.trim()) { setError('Değiştiren kişi zorunlu'); return; }
    try {
      await processApi.createVersion(selectedId, changedBy, changeDesc);
      setVersionModalOpen(false); setChangedBy(''); setChangeDesc('');
      const v = await processApi.getVersions(selectedId);
      setVersions(v);
    } catch { setError('Versiyon oluşturulamadı'); }
  };

  const handleRestore = async (versionId) => {
    if (!confirm('Bu versiyona geri dönmek istediğinize emin misiniz?')) return;
    try {
      await processApi.restoreVersion(selectedId, versionId);
      const v = await processApi.getVersions(selectedId);
      setVersions(v);
    } catch { setError('Geri yükleme başarısız'); }
  };

  const exportVersions = () => {
    const data = JSON.stringify(versions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `versiyonlar-${selectedId}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Heading style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Versiyonlama</Heading>
      {error && <InlineNotification title="Hata" subtitle={error} kind="error" onClose={() => setError('')} />}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <Select id="version-process-select" labelText="Süreç Seç" value={selectedId}
            onChange={e => setSelectedId(e.target.value)}>
            <SelectItem value="" text="Süreç seçiniz..." />
            {processes.map(p => (
              <SelectItem key={p.id} value={String(p.id)} text={`${p.name} (v${p.version})`} />
            ))}
          </Select>
        </div>
        {selectedId && (
          <>
            <Button onClick={() => setVersionModalOpen(true)}>Yeni Versiyon</Button>
            <Button kind="tertiary" onClick={exportVersions} renderIcon={Download}>Dışa Aktar</Button>
          </>
        )}
      </div>
      {versions.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Versiyon</TableHeader>
              <TableHeader>Değiştiren</TableHeader>
              <TableHeader>Açıklama</TableHeader>
              <TableHeader>Tarih</TableHeader>
              <TableHeader>İşlemler</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map(v => (
              <TableRow key={v.id}>
                <TableCell><Tag type="blue">v{v.versionNumber}</Tag></TableCell>
                <TableCell>{v.changedBy}</TableCell>
                <TableCell>{v.changeDescription}</TableCell>
                <TableCell>{new Date(v.changedAt).toLocaleString('tr-TR')}</TableCell>
                <TableCell>
                  <Button kind="ghost" size="sm" onClick={() => handleRestore(v.id)} renderIcon={Restart}>
                    Geri Yükle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Tile style={{ padding: '3rem', textAlign: 'center', color: '#6f6f6f' }}>
          {selectedId ? 'Henüz versiyon bulunmuyor.' : 'Versiyonları görüntülemek için bir süreç seçin.'}
        </Tile>
      )}
      <Modal
        open={versionModalOpen}
        modalHeading="Yeni Versiyon Oluştur"
        primaryButtonText="Oluştur"
        secondaryButtonText="İptal"
        onRequestSubmit={handleCreateVersion}
        onRequestClose={() => setVersionModalOpen(false)}
      >
        <TextInput id="changedBy" labelText="Değiştiren" value={changedBy}
          onChange={e => setChangedBy(e.target.value)} />
        <TextArea id="changeDesc" labelText="Değişiklik Açıklaması" value={changeDesc}
          onChange={e => setChangeDesc(e.target.value)} />
      </Modal>
    </div>
  );
}
