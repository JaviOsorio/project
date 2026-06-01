import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1780342876624 implements MigrationInterface {
    name = 'GeneratedMigration1780342876624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "document" character varying(50) NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "phone" character varying(30), "email" character varying(180), "notes" text, "companyId" uuid NOT NULL, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83b2dbc72a3eb0b4abd2efd7ea" ON "clients" ("document") `);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(180) NOT NULL, "description" text, "durationMinutes" integer NOT NULL, "price" numeric(10,2) NOT NULL, "active" boolean NOT NULL DEFAULT true, "companyId" uuid NOT NULL, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_019d74f7abcdcb5a0113010cb0" ON "services" ("name") `);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "description" character varying(255), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(180) NOT NULL, "password" character varying(255) NOT NULL, "phone" character varying(30), "active" boolean NOT NULL DEFAULT true, "refreshTokenHash" text, "companyId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employeeId" uuid NOT NULL, "branchId" uuid NOT NULL, "dayOfWeek" smallint NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "companyId" uuid NOT NULL, CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_58e2ed4621044feeefa8af89e6" ON "schedules" ("employeeId", "branchId", "dayOfWeek") `);
        await queryRunner.query(`CREATE TYPE "public"."companies_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(180) NOT NULL, "nit" character varying(50) NOT NULL, "phone" character varying(30), "email" character varying(180), "status" "public"."companies_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "UQ_ed61d4dcafb6fe0f595f5e0cbd0" UNIQUE ("nit"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3dacbb3eb4f095e29372ff8e13" ON "companies" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ed61d4dcafb6fe0f595f5e0cbd" ON "companies" ("nit") `);
        await queryRunner.query(`CREATE TYPE "public"."branches_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "companyId" uuid NOT NULL, "name" character varying(180) NOT NULL, "address" character varying(255) NOT NULL, "phone" character varying(30), "status" "public"."branches_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8387ed27b3d4ca53ec3fc7b029" ON "branches" ("name") `);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "clientId" uuid NOT NULL, "employeeId" uuid NOT NULL, "branchId" uuid NOT NULL, "appointmentDate" date NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "total" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."appointments_status_enum" NOT NULL DEFAULT 'PENDING', "companyId" uuid NOT NULL, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a425c89ea255d80620db5f29e8" ON "appointments" ("employeeId", "appointmentDate", "startTime", "endTime") `);
        await queryRunner.query(`CREATE TABLE "appointment_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "appointmentId" uuid NOT NULL, "serviceId" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_8423f59b66c157533b4df8b0459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7c31247a60d6eddd6ce2c3f2f1" ON "appointment_services" ("appointmentId", "serviceId") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`CREATE TABLE "user_branches" ("user_id" uuid NOT NULL, "branch_id" uuid NOT NULL, CONSTRAINT "PK_79e020eef929e23dfdd6f9b8720" PRIMARY KEY ("user_id", "branch_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a93a8dec13e6204974dd67386e" ON "user_branches" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7252d91dd610730c97d6b58ae7" ON "user_branches" ("branch_id") `);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_5016a1ccedbea5f26d46376d6b2" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_25334fffe4ce341dd1da38acbd9" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6f9395c9037632a31107c8a9e58" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_93cff6e8ed305a333ecd59a5acd" FOREIGN KEY ("employeeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_92233c841da29d74c4ed39e1d90" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_7223d4a518b4fa1ae81e1ef6833" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_a35729a94e7280cbebaaa541a20" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_5cc3c211e8db404ff99d6a13784" FOREIGN KEY ("employeeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_299d8147ef59909b1e6531e791c" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_48d9b0c87ddc67da594c616dca2" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_services" ADD CONSTRAINT "FK_0d96cf6582c33fafac115779919" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_services" ADD CONSTRAINT "FK_e6c70753e072adbd25ea521c890" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_branches" ADD CONSTRAINT "FK_a93a8dec13e6204974dd67386ed" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_branches" ADD CONSTRAINT "FK_7252d91dd610730c97d6b58ae79" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_branches" DROP CONSTRAINT "FK_7252d91dd610730c97d6b58ae79"`);
        await queryRunner.query(`ALTER TABLE "user_branches" DROP CONSTRAINT "FK_a93a8dec13e6204974dd67386ed"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "appointment_services" DROP CONSTRAINT "FK_e6c70753e072adbd25ea521c890"`);
        await queryRunner.query(`ALTER TABLE "appointment_services" DROP CONSTRAINT "FK_0d96cf6582c33fafac115779919"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_48d9b0c87ddc67da594c616dca2"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_299d8147ef59909b1e6531e791c"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_5cc3c211e8db404ff99d6a13784"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_c4dbd8eb292b83b5dc67be3cf45"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_a35729a94e7280cbebaaa541a20"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_7223d4a518b4fa1ae81e1ef6833"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_92233c841da29d74c4ed39e1d90"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_93cff6e8ed305a333ecd59a5acd"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6f9395c9037632a31107c8a9e58"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_25334fffe4ce341dd1da38acbd9"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_5016a1ccedbea5f26d46376d6b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7252d91dd610730c97d6b58ae7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a93a8dec13e6204974dd67386e"`);
        await queryRunner.query(`DROP TABLE "user_branches"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c31247a60d6eddd6ce2c3f2f1"`);
        await queryRunner.query(`DROP TABLE "appointment_services"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a425c89ea255d80620db5f29e8"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8387ed27b3d4ca53ec3fc7b029"`);
        await queryRunner.query(`DROP TABLE "branches"`);
        await queryRunner.query(`DROP TYPE "public"."branches_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed61d4dcafb6fe0f595f5e0cbd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3dacbb3eb4f095e29372ff8e13"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TYPE "public"."companies_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58e2ed4621044feeefa8af89e6"`);
        await queryRunner.query(`DROP TABLE "schedules"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_019d74f7abcdcb5a0113010cb0"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83b2dbc72a3eb0b4abd2efd7ea"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
