import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddNonUserNameToAppointments1593099625091
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'nonUserName',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'nonUserName');
  }
}
