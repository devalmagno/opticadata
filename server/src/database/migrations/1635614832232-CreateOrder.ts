import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateOrder1635614832232 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "orders",
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
                        name: "customer_id",
                        type: "uuid",
                        isNullable: true
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
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKPayment",
                        referencedTableName: "payments",
                        referencedColumnNames: ["id"],
                        columnNames: ["payment_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL"
                    },
                    {
                        name: "FKCustomer",
                        referencedTableName: "customers",
                        referencedColumnNames: ["id"],
                        columnNames: ["customer_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("orders");
    }

}
