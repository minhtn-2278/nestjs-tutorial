import { User } from "../src/users/users.entity";
import { Report } from "../src/reports/reports.entity";
import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456789',
  database: 'nestjs_test',
  entities: [User, Report],
})

afterAll(async () => {
  const dataSource = await appDataSource.initialize();
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`SET FOREIGN_KEY_CHECKS = 0;`)
    await repository.query(`TRUNCATE ${entity.tableName};`)
    await repository.query(`SET FOREIGN_KEY_CHECKS = 1;`)
  }
})
