import sqlite3, { Database } from "sqlite3"
import Bcrypt from "bcryptjs"

const db = new (sqlite3.verbose()).Database('./db.sqlite3')
const SALT = Bcrypt.genSaltSync(10)


interface DB extends Database {
    promise: <T = any>(method: DbMethodName, ...args: any[]) => Promise<T>
}

db.serialize(() => {

    // Create users table ------------------------------------------------------
    db.run(`DROP TABLE IF EXISTS "users"`)
    db.run(`
        CREATE TABLE "users" (
            "id"        Integer NOT NULL PRIMARY KEY AutoIncrement,
            "username"  Text    NOT NULL,
            "password"  Text    NOT NULL,
            "role"      Text    NOT NULL,
            "lastLogin" DateTime,
            "sid"       Text
        )`
    );

    // Insert users ------------------------------------------------------------
    db.run(
        "INSERT INTO users (username,password,role) values ('admin', ?, 'admin')",
        Bcrypt.hashSync('admin-password', SALT)
    );
    db.run(
        "INSERT INTO users (username,password,role) values ('patient', ?, 'user')",
        Bcrypt.hashSync('patient-password', SALT)
    );

    // Create jobs table -------------------------------------------------------
    db.run(`DROP TABLE IF EXISTS "jobs"`)
    db.run(`
        CREATE TABLE "jobs" (
            "id"             Integer  NOT NULL PRIMARY KEY AutoIncrement,
            "userId"         Integer  NOT NULL,
            "json"           Text     NOT NULL,
            "readonly"       Boolean DEFAULT 0,
            "statusUrl"      Text NOT NULL,
            "customizeUrl"   Text
        )`
    );

    // Insert one read-only job ------------------------------------------------
    db.run(`
        INSERT INTO "jobs" (
            id, userId, json, readonly, statusUrl, customizeUrl
        ) values (
            NULL, $userId, $json, $readonly, $statusUrl, $customizeUrl
        )`, {
        $userId: 1,
        $json: JSON.stringify({
            id: "job-1",
            patient: { id: "sample_patient_id", name: "Patient Name" },
            createdAt: Date.now(),
            completedAt: Date.now(),
            manifest: {},
            status: "retrieved",
            parameters: {
                // Electronic Records
                visits: { group: 1, enabled: false, name: "Clinic Visits" },
                labs: { group: 1, enabled: false, name: "Lab Reports" },
                billing: { group: 1, enabled: false, name: "Billing Records" },
                medicalRecord: { group: 1, enabled: false, name: "Other Records", from: false, to: false },

                // Other Records and Documents
                dischargeSummary: { group: 2, enabled: false, name: "Discharge Summary" },
                operative: { group: 2, enabled: false, name: "Operative Reports" },
                pathology: { group: 2, enabled: false, name: "Pathology Reports" },
                radiology: { group: 2, enabled: false, name: "Radiology Reports" },
                photographs: { group: 2, enabled: false, name: "Photographs" },
                other: { group: 2, enabled: false, name: "Other" },
            },
            authorizations: {
                hiv: { value: false, name: "HIV test results" },
                alcoholAndDrug: { value: false, name: "Alcohol and Drug Abuse Records" },
                mentalHealth: { value: false, name: "Details of Mental Health Diagnosis and/or Treatment" },
                confidential: { value: false, name: "Confidential Communications with a Licensed Social Worker" },
                domesticViolence: { value: false, name: "Details of Domestic Violence Victims Counseling" },
                sexualAssault: { value: false, name: "Details of Sexual Assault Counseling" },
                genetic: { value: "", name: "Genetic Screening" },
                other: { value: "", name: "Other(s)" }
            },
            attachments: []
        }),
        $readonly: 1,
        $statusUrl: "",
        $customizeUrl: ""
    });

    db.run(`
        INSERT INTO "jobs" (
            id, userId, json, readonly, statusUrl, customizeUrl
        ) values (
            NULL, $userId, $json, $readonly, $statusUrl, $customizeUrl
        )`, {
        $userId: 2,
        $json: JSON.stringify({
            id: "job-2",
            patient: { id: "sample_patient_id", name: "Patient Name" },
            createdAt: Date.now(),
            completedAt: Date.now(),
            manifest: {},
            status: "retrieved",
            parameters: {
                // Electronic Records
                visits: { group: 1, enabled: false, name: "Clinic Visits" },
                labs: { group: 1, enabled: false, name: "Lab Reports" },
                billing: { group: 1, enabled: false, name: "Billing Records" },
                medicalRecord: { group: 1, enabled: false, name: "Other Records", from: false, to: false },

                // Other Records and Documents
                dischargeSummary: { group: 2, enabled: false, name: "Discharge Summary" },
                operative: { group: 2, enabled: false, name: "Operative Reports" },
                pathology: { group: 2, enabled: false, name: "Pathology Reports" },
                radiology: { group: 2, enabled: false, name: "Radiology Reports" },
                photographs: { group: 2, enabled: false, name: "Photographs" },
                other: { group: 2, enabled: false, name: "Other" },
            },
            authorizations: {
                hiv: { value: false, name: "HIV test results" },
                alcoholAndDrug: { value: false, name: "Alcohol and Drug Abuse Records" },
                mentalHealth: { value: false, name: "Details of Mental Health Diagnosis and/or Treatment" },
                confidential: { value: false, name: "Confidential Communications with a Licensed Social Worker" },
                domesticViolence: { value: false, name: "Details of Domestic Violence Victims Counseling" },
                sexualAssault: { value: false, name: "Details of Sexual Assault Counseling" },
                genetic: { value: "", name: "Genetic Screening" },
                other: { value: "", name: "Other(s)" }
            },
            attachments: []
        }),
        $readonly: 1,
        $statusUrl: "",
        $customizeUrl: ""
    });

});


export default db as DB

type DbMethodName = "run" | "get" | "all" | "each" | "exec" | "prepare"

/**
 * Calls database methods and returns a promise
 */
Object.defineProperty(db, "promise", {
    get() {
        return function (method: DbMethodName, ...args: any[]) {
            return new Promise((resolve, reject) => {
                args.push((error: Error, result: any) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
                (db[method] as (...args: any[]) => any)(...args);
            });
        }
    }
});

// db.close();