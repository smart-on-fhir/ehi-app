import sqlite3, { Database } from "sqlite3"
import { readFile } from "fs/promises"
import { existsSync } from "fs"

const ENV = process.env.NODE_ENV || "development"
const DB_PATH = __dirname + `/database.${ENV}.db`
const DB_EXISTS = existsSync(DB_PATH)

const db = new (sqlite3.verbose()).Database(__dirname + `/database.${ENV}.db`)

let mainPromise: Promise<any> | null = null

type DbMethodName = "run" | "get" | "all" | "each" | "exec" | "prepare"

interface DB extends Database {
    promise: <T = any>(method: DbMethodName, ...args: any[]) => Promise<T>
    init: () => Promise<void>
}

async function promise<T = any>(method: DbMethodName, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
        args.push(function (this: unknown, error: Error, result: any) {
            if (error) {
                reject(error);
            } else {
                resolve(method === "run" ? this as T : result as T);
            }
        });
        (db[method] as (...args: any[]) => any)(...args);
    });
}

async function init() {
    if (DB_EXISTS && ENV === "development") {
        return true
    }
    mainPromise = executeSQLFile(__dirname + "/tables.sql")
        .then(() => executeSQLFile(__dirname + `/seeds.${ENV}.sql`))
    return mainPromise
}

async function executeSQLFile(path: string) {
    const sql = await readFile(path, "utf8")
    const lines = sql.split("\n").map(l => l.trim()).filter(Boolean).map(l => l.replace(/--.*$/gm, ""))
    const statements = lines.join("\n").split(/;+/)
    for (const statement of statements) {
        await promise("exec", statement)
    }
}

async function main(): Promise<DB> {
    if (!mainPromise) {
        mainPromise = init()
    }
    await mainPromise;
    return db as DB
}

/**
 * Calls database methods and returns a promise
 */
main.promise = async <T = any>(method: DbMethodName, ...args: any[]): Promise<T> => {
    if (!mainPromise) {
        mainPromise = init()
    }
    await mainPromise;
    return await promise<T>(method, ...args)
};

main.init = init;

export default main
