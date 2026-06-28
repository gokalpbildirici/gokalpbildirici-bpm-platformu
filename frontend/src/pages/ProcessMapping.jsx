import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Tile, Select, SelectItem, Button, InlineNotification } from '@carbon/react';
import { Add, Download } from '@carbon/icons-react';
import { processApi } from '../api/client';

export default function ProcessMapping() {
  const [processes, setProcesses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    processApi.getAll().then(setProcesses).catch(() => setError('Süreçler yüklenemedi'));
  }, []);

  useEffect(() => {
    if (!selectedId) { setSteps([]); return; }
    processApi.getSteps(selectedId).then(setSteps).catch(() => setError('Adımlar yüklenemedi'));
  }, [selectedId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || steps.length === 0) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startX = 60;
    const startY = 50;
    const boxW = 160;
    const boxH = 50;
    const gapX = 220;
    const gapY = 100;
    const perRow = Math.min(3, steps.length);

    const nodes = steps.map((s, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      return {
        ...s,
        x: startX + col * (boxW + gapX),
        y: startY + row * (boxH + gapY),
      };
    });

    ctx.strokeStyle = '#0f62fe';
    ctx.lineWidth = 2;

    nodes.forEach((node, i) => {
      if (i < nodes.length - 1) {
        const next = nodes[i + 1];
        ctx.beginPath();
        ctx.moveTo(node.x + boxW / 2, node.y + boxH);
        ctx.lineTo(next.x + boxW / 2, next.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(next.x + boxW / 2 - 6, next.y + 6);
        ctx.lineTo(next.x + boxW / 2, next.y);
        ctx.lineTo(next.x + boxW / 2 + 6, next.y + 6);
        ctx.stroke();
      }
    });

    nodes.forEach(node => {
      if (node.startNode) {
        ctx.fillStyle = '#42be65';
      } else if (node.endNode) {
        ctx.fillStyle = '#fa4d56';
      } else {
        ctx.fillStyle = '#0f62fe';
      }
      ctx.fillRect(node.x, node.y, boxW, boxH);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px IBM Plex Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const displayText = node.name.length > 15 ? node.name.slice(0, 15) + '...' : node.name;
      ctx.fillText(displayText, node.x + boxW / 2, node.y + boxH / 2);
    });
  }, [steps]);

  const exportAsPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'surec-haritasi.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const selectedProcess = processes.find(p => String(p.id) === selectedId);

  return (
    <div>
      <Heading style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Süreç Haritalama</Heading>
      {error && <InlineNotification title="Hata" subtitle={error} kind="error" onClose={() => setError('')} />}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <Select id="process-select" labelText="Süreç Seç" value={selectedId}
            onChange={e => setSelectedId(e.target.value)}>
            <SelectItem value="" text="Süreç seçiniz..." />
            {processes.filter(p => p.active).map(p => (
              <SelectItem key={p.id} value={String(p.id)} text={`${p.name} (v${p.version}) - ${p.steps?.length || 0} adım`} />
            ))}
          </Select>
        </div>
        {selectedId && steps.length === 0 && (
          <Button renderIcon={Add} onClick={() => navigate(`/processes/${selectedId}`)}>
            Adım Ekle
          </Button>
        )}
        {steps.length > 0 && (
          <Button kind="tertiary" onClick={exportAsPNG} renderIcon={Download}>
            PNG Dışa Aktar
          </Button>
        )}
      </div>
      {steps.length > 0 ? (
        <Tile style={{ overflow: 'auto' }}>
          <canvas ref={canvasRef} width={800} height={400}
            style={{ border: '1px solid #e0e0e0', borderRadius: '4px', display: 'block' }} />
        </Tile>
      ) : (
        <Tile style={{ padding: '3rem', textAlign: 'center', color: '#6f6f6f' }}>
          {!selectedId ? (
            'Görselleştirmek için yukarıdan bir süreç seçin.'
          ) : (
            <div>
              <p style={{ marginBottom: '1rem' }}>Bu süreçte henüz adım bulunmuyor.</p>
              <Button renderIcon={Add} onClick={() => navigate(`/processes/${selectedId}`)}>
                {selectedProcess?.name} sürecine adım ekle
              </Button>
            </div>
          )}
        </Tile>
      )}
    </div>
  );
}
