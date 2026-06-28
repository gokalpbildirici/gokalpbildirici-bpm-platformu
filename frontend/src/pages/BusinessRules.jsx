import { useEffect, useState } from 'react';
import {
  Heading, Button, Modal, TextInput, TextArea, Tile, Tag, Toggle,
  Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  InlineNotification, Select, SelectItem,
} from '@carbon/react';
import { Add, Edit, TrashCan } from '@carbon/icons-react';
import { ruleApi, processApi } from '../api/client';

export default function BusinessRules() {
  const [rules, setRules] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRule, setEditRule] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', condition: '', action: '', active: true, process: null,
  });
  const [error, setError] = useState('');

  const load = () => Promise.all([
    ruleApi.getAll().then(setRules),
    processApi.getAll().then(setProcesses),
  ]).catch(() => setError('Veriler yüklenemedi'));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditRule(null);
    setForm({ name: '', description: '', condition: '', action: '', active: true, process: null });
    setModalOpen(true);
  };

  const openEdit = (rule) => {
    setEditRule(rule);
    setForm({
      name: rule.name, description: rule.description || '',
      condition: rule.condition, action: rule.action,
      active: rule.active, process: rule.process || null,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Kural adı zorunlu'); return; }
    try {
      if (editRule) {
        await ruleApi.update(editRule.id, form);
      } else {
        await ruleApi.create(form);
      }
      setModalOpen(false); load();
    } catch { setError('Kaydetme başarısız'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Kuralı silmek istediğinize emin misiniz?')) return;
    try { await ruleApi.delete(id); load(); }
    catch { setError('Silme başarısız'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Heading style={{ fontSize: '1.5rem' }}>İş Kuralları Yönetimi</Heading>
        <Button renderIcon={Add} onClick={openCreate}>Yeni Kural</Button>
      </div>
      {error && <InlineNotification title="Hata" subtitle={error} kind="error" onClose={() => setError('')} />}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Kural Adı</TableHeader>
            <TableHeader>Koşul</TableHeader>
            <TableHeader>Aksiyon</TableHeader>
            <TableHeader>Durum</TableHeader>
            <TableHeader>İşlemler</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.name}</TableCell>
              <TableCell style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.condition}
              </TableCell>
              <TableCell style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.action}
              </TableCell>
              <TableCell>
                <Tag type={r.active ? 'green' : 'red'}>{r.active ? 'Aktif' : 'Pasif'}</Tag>
              </TableCell>
              <TableCell>
                <Button kind="ghost" size="sm" onClick={() => openEdit(r)}><Edit /></Button>
                <Button kind="danger--ghost" size="sm" onClick={() => handleDelete(r.id)}><TrashCan /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={modalOpen}
        modalHeading={editRule ? 'Kural Düzenle' : 'Yeni Kural'}
        primaryButtonText="Kaydet"
        secondaryButtonText="İptal"
        onRequestSubmit={handleSave}
        onRequestClose={() => setModalOpen(false)}
      >
        <TextInput id="ruleName" labelText="Kural Adı" value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        <TextArea id="ruleDesc" labelText="Açıklama" value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        <TextArea id="ruleCondition" labelText="Koşul (örn: izinGunu > 3)" value={form.condition}
          onChange={e => setForm(p => ({ ...p, condition: e.target.value }))} />
        <TextArea id="ruleAction" labelText="Aksiyon (örn: mudurOnayiGerekir)" value={form.action}
          onChange={e => setForm(p => ({ ...p, action: e.target.value }))} />
        <Toggle id="ruleActive" labelText="Aktif" toggled={form.active}
          onToggle={v => setForm(p => ({ ...p, active: v }))} />
        <Select id="ruleProcess" labelText="Bağlı Süreç" value={form.process?.id || ''}
          onChange={e => {
            const pid = e.target.value;
            setForm(p => ({ ...p, process: pid ? { id: parseInt(pid) } : null }));
          }}>
          <SelectItem value="" text="Süreç seçiniz..." />
          {processes.map(p => (
            <SelectItem key={p.id} value={String(p.id)} text={p.name} />
          ))}
        </Select>
      </Modal>
    </div>
  );
}
