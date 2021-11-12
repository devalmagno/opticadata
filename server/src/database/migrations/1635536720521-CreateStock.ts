import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateStock1635536720521 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "stock",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "product_id",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "provider_id",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "quantity",
                        type: "int"
                    },
                    {
                        name: "entry",
                        type: "boolean",
                        default: true
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
                        name: "FKProduct",
                        referencedTableName: "products",
                        referencedColumnNames: ["id"],
                        columnNames: ["product_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL"
                    },
                    {
                        name: "FKProvider",
                        referencedTableName: "provider",
                        referencedColumnNames: ["id"],
                        columnNames: ["provider_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("stock");
    }

}
