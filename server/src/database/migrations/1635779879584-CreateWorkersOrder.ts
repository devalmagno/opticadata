import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateWorkersOrder1635779879584 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "workers_order",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "order_id",
                        type: "uuid",
                    },
                    {
                        name: "worker_id",
                        type: "uuid",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKOrder",
                        referencedTableName: "orders",
                        referencedColumnNames: ["id"],
                        columnNames: ["order_id"],
                        onDelete: "SET NULL",   
                        onUpdate: "SET NULL"
                    },
                    {
                        name: "FKWorker",
                        referencedTableName: "workers",
                        referencedColumnNames: ["id"],
                        columnNames: ["worker_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("workers_order");
    }

}
