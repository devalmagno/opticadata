import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateProduct1634264296144 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "productcategory_id",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "unit_price",
                        type: "float"
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
                ]
            })
        )

        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                name: "FKProductCategories",
                referencedTableName: "product_categories",
                referencedColumnNames: ["id"],
                columnNames: ["productcategory_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("products", "FKProductCategories");
        await queryRunner.dropTable("products");
    }

}
