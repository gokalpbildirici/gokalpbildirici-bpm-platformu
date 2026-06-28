import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  Button, Modal, TextInput, TextArea, Heading, InlineNotification,
  NumberInput, Tile,
} from '@carbon/react';
import { Add, TrashCan, ArrowRight } from '@carbon/icons-react';
import { processApi } from '../api/client';

const headers = ['ID', 'Süreç Adı', 'Versiyon', 'Durum', 'Adımlar', 'Oluşturulma', 'İşlemler'];

export default function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => processApi.getAll().then(setProcesses).catch(() => setError('Süreçler yüklenemedi'));

  useEffect(() => { load(); }, []);

  const addStepInput = () => {
    setSteps(s => [...s, { name: '', description: '', stepOrder: s.length + 1 }]);
  };

  const removeStepInput = (index) => {
    setSteps(s => s.filter((_, i) => i !== index).map((st, i) => ({ ...st, stepOrder: i + 1 })));
  };

  const updateStep = (index, field, value) => {
    setSteps(s => s.map((st, i) => i === index ? { ...st, [field]: value } : st));
  };

  const handleCreate = async () => {
    if (!name.trim()) { setError('Süreç adı zorunlu'); return; }
    try {
      const process = await processApi.create({ name, description, createdBy: 'Admin' });
      for (const step of steps) {
        if (step.name.trim()) {
          await processApi.addStep(process.id, {
            name: step.name,
            description: step.description,
            stepOrder: step.stepOrder,
          });
        }
      }
      setModalOpen(false);
      setName('');
      setDescription('');
      setSteps([]);
      setError('');
      load();
      navigate(`/processes/${process.id}`);
    } catch { setError('Oluşturma başarısız'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Süreci devre dışı bırakmak istediğinize emin misiniz?')) return;
    try { await processApi.delete(id); load(); }
    catch { setError('Silme başarısız'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Heading style={{ fontSize: '1.5rem' }}>Süreç Yönetimi</Heading>
        <Button renderIcon={Add} onClick={() => setModalOpen(true)}>Yeni Süreç</Button>
      </div>
      {error && <InlineNotification title="Hata" subtitle={error} kind="error" onClose={() => setError('')} />}
      <Table>
        <TableHead>
          <TableRow>{headers.map(h => <TableHeader key={h}>{h}</TableHeader>)}</TableRow>
        </TableHead>
        <TableBody>
          {processes.map(p => (
            <TableRow key={p.id} onClick={() => navigate(`/processes/${p.id}`)} style={{ cursor: 'pointer' }}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>v{p.version}</TableCell>
              <TableCell>{p.active ? 'Aktif' : 'Pasif'}</TableCell>
              <TableCell>{p.steps?.length || 0}</TableCell>
              <TableCell>{new Date(p.createdAt).toLocaleDateString('tr-TR')}</TableCell>
              <TableCell>
                <Button kind="ghost" size="sm" onClick={e => { e.stopPropagation(); navigate(`/processes/${p.id}`); }}>
                  <ArrowRight />
                </Button>
                <Button kind="danger--ghost" size="sm" onClick={e => { e.stopPropagation(); handleDelete(p.id); }}>
                  <TrashCan />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={modalOpen}
        modalHeading="Yeni Süreç Oluştur"
        primaryButtonText="Oluştur"
        secondaryButtonText="İptal"
        onRequestSubmit={handleCreate}
        onRequestClose={() => setModalOpen(false)}
      >
        <TextInput id="name" labelText="Süreç Adı" value={name} onChange={e => setName(e.target.value)} />
        <TextArea id="desc" labelText="Açıklama" value={description} onChange={e => setDescription(e.target.value)} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          <Heading style={{ fontSize: '1rem' }}>Süreç Adımları</Heading>
          <Button kind="tertiary" size="sm" renderIcon={Add} onClick={addStepInput}>Adım Ekle</Button>
        </div>

        {steps.length === 0 && (
          <Tile style={{ padding: '1rem', textAlign: 'center', color: '#6f6f6f', marginBottom: '0.5rem' }}>
            Henüz adım eklenmedi. "Adım Ekle" butonuna tıklayarak süreç adımlarınızı tanımlayın.
          </Tile>
        )}

        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
            <NumberInput
              id={`step-order-${i}`}
              label="Sıra"
              value={step.stepOrder}
              min={1}
              max={99}
              onChange={e => updateStep(i, 'stepOrder', parseInt(e.imaginaryTarget.value) || 1)}
              style={{ width: '80px' }}
            />
            <TextInput
              id={`step-name-${i}`}
              labelText="Adım Adı"
              value={step.name}
              onChange={e => updateStep(i, 'name', e.target.value)}
              style={{ flex: 1 }}
            />
            <Button kind="danger--ghost" onClick={() => removeStepInput(i)}>
              <TrashCan />
            </Button>
          </div>
        ))}
      </Modal>
    </div>
  );
}
