import { useEffect, useState } from 'react';
import {
  Heading, Button, Modal, TextInput, TextArea, Tile, Tag,
  Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  InlineNotification, MultiSelect,
} from '@carbon/react';
import { Add, Edit, TrashCan } from '@carbon/icons-react';
import { roleApi } from '../api/client';

const allPermissions = [
  { id: 'process_create', label: 'Süreç Oluşturma' },
  { id: 'process_read', label: 'Süreç Görüntüleme' },
  { id: 'process_update', label: 'Süreç Güncelleme' },
  { id: 'process_delete', label: 'Süreç Silme' },
  { id: 'rule_create', label: 'Kural Oluşturma' },
  { id: 'rule_read', label: 'Kural Görüntüleme' },
  { id: 'rule_update', label: 'Kural Güncelleme' },
  { id: 'report_read', label: 'Rapor Görüntüleme' },
  { id: 'admin', label: 'Yönetim' },
];

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', permissions: [] });
  const [error, setError] = useState('');

  const load = () => roleApi.getAll().then(setRoles).catch(() => setError('Roller yüklenemedi'));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditRole(null);
    setForm({ name: '', description: '', permissions: [] });
    setModalOpen(true);
  };

  const openEdit = (role) => {
    setEditRole(role);
    setForm({ name: role.name, description: role.description || '', permissions: role.permissions || [] });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Rol adı zorunlu'); return; }
    try {
      if (editRole) {
        await roleApi.update(editRole.id, form);
      } else {
        await roleApi.create(form);
      }
      setModalOpen(false); load();
    } catch { setError('Kaydetme başarısız'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Rolü silmek istediğinize emin misiniz?')) return;
    try { await roleApi.delete(id); load(); }
    catch { setError('Silme başarısız'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Heading style={{ fontSize: '1.5rem' }}>Rol ve Yetki Yönetimi</Heading>
        <Button renderIcon={Add} onClick={openCreate}>Yeni Rol</Button>
      </div>
      {error && <InlineNotification title="Hata" subtitle={error} kind="error" onClose={() => setError('')} />}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Rol</TableHeader>
            <TableHeader>Açıklama</TableHeader>
            <TableHeader>Yetkiler</TableHeader>
            <TableHeader>İşlemler</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map(r => (
            <TableRow key={r.id}>
              <TableCell><Tag type="blue">{r.name}</Tag></TableCell>
              <TableCell>{r.description}</TableCell>
              <TableCell>
                {r.permissions?.map(p => (
                  <Tag key={p} style={{ marginRight: '0.25rem', marginBottom: '0.25rem' }} type="green">{p}</Tag>
                )) || '-'}
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
        modalHeading={editRole ? 'Rol Düzenle' : 'Yeni Rol'}
        primaryButtonText="Kaydet"
        secondaryButtonText="İptal"
        onRequestSubmit={handleSave}
        onRequestClose={() => setModalOpen(false)}
      >
        <TextInput id="roleName" labelText="Rol Adı" value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        <TextArea id="roleDesc" labelText="Açıklama" value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        <MultiSelect
          id="permissions"
          label="Yetki Seç"
          items={allPermissions}
          itemToString={item => item?.label || ''}
          selectedItems={allPermissions.filter(p => form.permissions.includes(p.id))}
          onChange={({ selectedItems }) =>
            setForm(p => ({ ...p, permissions: selectedItems.map(i => i.id) }))
          }
          titleText="Yetkiler"
        />
      </Modal>
    </div>
  );
}
