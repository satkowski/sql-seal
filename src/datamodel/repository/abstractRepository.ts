import { SqlSealDatabase } from "../../database/database";

export abstract class Repository {
    constructor(protected readonly db: SqlSealDatabase) { }
}