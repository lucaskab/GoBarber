import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointments1587188580503
  implements MigrationInterface {
  // Método UP: Colocar o que queremos que seja feito no BD quando essa migration for executada
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'provider',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  // Método Down: Se ocorrer algum problema, vou dar fallback(), desfazer o que fez no método UP
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments');
  }
}

/**
 * Linha do Tempo
 *
 * 1A semana: Agendamentos
 * 2A semana: Usuários
 * (Novo DEV) 3A semana : Edição na tabela de agendamentos
 * 4A semana: Compras
 */
