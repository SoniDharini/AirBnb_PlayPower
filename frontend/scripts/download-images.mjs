import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/images');
await mkdir(dir, { recursive: true });

const images = {
  'jacuzzi-balcony.jpg': 'photo-1571896349842-33c89424de2d',
  'bedroom-01.jpg': 'photo-1616594039964-ae9021a400a0',
  'living-01.jpg': 'photo-1600210492486-724fe5c67fb0',
  'kitchen-01.jpg': 'photo-1556911220-bff31c812dba',
  'pool-01.jpg': 'photo-1576013551627-0cc20b96c2a7',
  'beach-candolim.jpg': 'photo-1507525428034-b723cf961d3e',
  'resort-exterior.jpg': 'photo-1600585154340-be6161a56a0c',
  'bathroom-01.jpg': 'photo-1620626011761-996317b8d101',
  'bedroom-02.jpg': 'photo-1631049307264-da0ec9d70304',
  'bedroom-03.jpg': 'photo-1522771739844-6a9f6d5f14af',
  'living-02.jpg': 'photo-1560448204-e02f11c3d0e2',
  'living-03.jpg': 'photo-1618221195710-dd6b41faaea6',
  'living-04.jpg': 'photo-1493809842364-78817add7ffb',
  'dining-01.jpg': 'photo-1414235077428-338989a2e8c0',
  'kitchen-02.jpg': 'photo-1556909114-f6e7ad7d3136',
  'kitchen-03.jpg': 'photo-1600566753190-17f0baa2a6c3',
  'gym-01.jpg': 'photo-1534438327276-14e5300c3a48',
  'gym-02.jpg': 'photo-1540497077202-7c8a3999166f',
  'spa-01.jpg': 'photo-1540555700478-4be289fbecef',
  'balcony-01.jpg': 'photo-1520250497591-112f2f40a3f4',
  'host-1.jpg': 'photo-1544005313-94ddf0286df2',
  'host-2.jpg': 'photo-1500648767791-00dcc994a43e',
  'host-3.jpg': 'photo-1531123897727-8f129e1688ce',
};

let failed = 0;
await Promise.all(
  Object.entries(images).map(async ([name, id]) => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=75`;
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) throw new Error(String(res.status));
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) throw new Error('too small');
      await writeFile(path.join(dir, name), buf);
      console.log('ok', name, buf.length);
    } catch (error) {
      failed += 1;
      console.error('fail', name, error.message);
    }
  }),
);
if (failed) process.exitCode = 1;
