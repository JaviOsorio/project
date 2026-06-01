import { DataSource } from 'typeorm';

import { RoleEntity } from '../../roles/entities/role.entity';
import dataSource from '../data-source';

const roleNames = [
  { name: 'SUPER_ADMIN', description: 'Administración global del sistema' },
  { name: 'ADMIN', description: 'Administración de empresa' },
  { name: 'EMPLOYEE', description: 'Gestión operativa de agenda y clientes' },
  { name: 'CLIENT', description: 'Reserva y consulta de citas' },
];

async function seedRoles(ds: DataSource) {
  if (!ds.isInitialized) {
    await ds.initialize();
  }

  for (const role of roleNames) {
    await ds.getRepository(RoleEntity).upsert(role, ['name']);
  }

  await ds.destroy();
}

void seedRoles(dataSource).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
