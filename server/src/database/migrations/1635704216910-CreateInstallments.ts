import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateInstallments1635704216910 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "installments",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "payment_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "price",
                        type: "float"
                    },
                    {
                        name: "payment_date",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "status",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKPayment",
                        referencedTableName: "payments",
                        referencedColumnNames: ["id"],
                        columnNames: ["payment_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("installments");
    }

}
