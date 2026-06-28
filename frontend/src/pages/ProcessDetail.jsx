import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heading, Tile, Button, Modal, TextInput, TextArea, NumberInput,
  Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  InlineNotification, Tag,
} from '@carbon/react';
import { Add, ArrowLeft, TrashCan } from '@carbon/icons-react';
import { processApi } from '../api/client';

export default function ProcessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [process, setProcess] = useState(null);
  const [steps, setSteps] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepForm, setStepForm] = useState({ name: '', description: '', stepOrder: 1 });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setProcess(await processApi.get(id));
      setSteps(await processApi.getSteps(id));
    } catch { setError('Süreç yüklenemedi'); }
  };

  useEffect(() => { load(); }, [id]);

  const handleAddStep = async () => {
    try {
      await processApi.addStep(id, stepForm);
      setModalOpen(false);
      setStepForm({ name: '', description: '', stepOrder: steps.length + 1 });
      load();
    } catch { setError('Adım eklenemedi'); }
  };

  const handleDeleteStep = async (stepId) => {
    try { await processApi.deleteStep(id, stepId); load(); }
    catch { setError('Adım silinemedi'); }
  };

  if (!process) return <Tile><Heading>Yükleniyor...</Heading></Tile>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Button kind="ghost" onClick={() => navigate('/processes')}><ArrowLeft /></Button>
        <Heading style={{ fontSize: '1.5rem' }}>{process.name}</Heading>
        <Tag type="blue">v{process.version}</Tag>
        <Tag type={process.active ? 'green' : 'red'}>{process.active ? 'Aktif' : 'Pasif'}</Tag>
      </div>
      {error && <InlineNotification title="Hata" subtitle={error} kind="error" onClose={() => setError('')} />}
      <Tile style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <Heading style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Süreç Bilgisi</Heading>
        <p><strong>Açıklama:</strong> {process.description || 'Açıklama yok'}</p>
        <p><strong>Oluşturan:</strong> {process.createdBy}</p>
        <p><strong>Oluşturulma:</strong> {new Date(process.createdAt).toLocaleString('tr-TR')}</p>
      </Tile>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Heading style={{ fontSize: '1.25rem' }}>Süreç Adımları</Heading>
        <Button renderIcon={Add} onClick={() => setModalOpen(true)}>Adım Ekle</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Sıra</TableHeader>
            <TableHeader>Adım Adı</TableHeader>
            <TableHeader>Açıklama</TableHeader>
            <TableHeader>İşlemler</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {steps.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.stepOrder}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.description}</TableCell>
              <TableCell>
                <Button kind="danger--ghost" size="sm" onClick={() => handleDeleteStep(s.id)}>
                  <TrashCan />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={modalOpen}
        modalHeading="Adım Ekle"
        primaryButtonText="Ekle"
        secondaryButtonText="İptal"
        onRequestSubmit={handleAddStep}
        onRequestClose={() => setModalOpen(false)}
      >
        <TextInput id="stepName" labelText="Adım Adı" value={stepForm.name}
          onChange={e => setStepForm(p => ({ ...p, name: e.target.value }))} />
        <TextArea id="stepDesc" labelText="Açıklama" value={stepForm.description}
          onChange={e => setStepForm(p => ({ ...p, description: e.target.value }))} />
        <NumberInput id="stepOrder" label="Sıra" value={stepForm.stepOrder}
          onChange={e => setStepForm(p => ({ ...p, stepOrder: parseInt(e.imaginaryTarget.value) || 1 }))} />
      </Modal>
    </div>
  );
}
