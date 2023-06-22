import sqlite3, { Database } from "sqlite3"
import { join } from "path"
import { readdirSync, rmSync, statSync } from "fs"
import { readFile } from "fs/promises"

const ENV = process.env.NODE_ENV || "development"

const db = new (sqlite3.verbose()).Database(__dirname + `/database.${ENV}.db`)

let mainPromise: Promise<any> | null = null

type DbMethodName = "run" | "get" | "all" | "each" | "exec" | "prepare"

interface DB extends Database {
    promise: <T = any>(method: DbMethodName, ...args: any[]) => Promise<T>
    init: () => Promise<void>
}

async function main(): Promise<DB> {
    if (!mainPromise) {
        mainPromise = main.init()
    }
    await mainPromise;
    return db as DB
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
};

/**
 * Calls database methods and returns a promise
 */
main.promise = async <T = any>(method: DbMethodName, ...args: any[]): Promise<T> => {
    if (!mainPromise) {
        mainPromise = main()
    }
    await mainPromise;
    return await promise<T>(method, ...args)
};

main.init = async () => {
    await executeSQLFile(__dirname + "/tables.sql")
    await executeSQLFile(__dirname + `/seeds.${ENV}.sql`)
}

async function executeSQLFile(path: string) {
    const sql = await readFile(path, "utf8")
    const lines = sql.split("\n").map(l => l.trim()).filter(Boolean).map(l => l.replace(/--.*$/gm, ""))
    const statements = lines.join("\n").split(/;+/)

    for (const statement of statements) {
        await promise("exec", statement)
    }
}

function cleanup() {
    const base = join(__dirname, "../jobs")
    const items = readdirSync(base);
    for (const id of items) {
        const dir = join(base, id)
        if (statSync(dir).isDirectory()) {
            rmSync(dir, { force: true, recursive: true })
        }
    }
}
cleanup()

export default main
