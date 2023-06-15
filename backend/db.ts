import sqlite3, { Database } from "sqlite3"
import Bcrypt from "bcryptjs"
import config from "./config"
import { join } from "path"
import { readdirSync, rmSync, statSync } from "fs"

const db = new (sqlite3.verbose()).Database(config.db)

let mainPromise: Promise<any> | null = null

type DbMethodName = "run" | "get" | "all" | "each" | "exec" | "prepare"

interface DB extends Database {
    promise: <T = any>(method: DbMethodName, ...args: any[]) => Promise<T>
}

const sampleParameters = {
    "visits": {
        "name": "Clinic Visits",
        "enabled": false,
        "notes": ""
    },
    "labs": {
        "name": "Lab Reports",
        "enabled": false,
        "notes": ""
    },
    "billing": {
        "name": "Billing Records",
        "enabled": false,
        "notes": ""
    },
    "medicalRecord": {
        "name": "Other Records",
        "enabled": false,
        "notes": ""
    },
    "dischargeSummary": {
        "name": "Discharge Summary",
        "enabled": false,
        "notes": ""
    },
    "operative": {
        "name": "Operative Reports",
        "enabled": false,
        "notes": ""
    },
    "pathology": {
        "name": "Pathology Reports",
        "enabled": false,
        "notes": ""
    },
    "radiology": {
        "name": "Radiology Reports",
        "enabled": false,
        "notes": ""
    },
    "photographs": {
        "name": "Photographs",
        "enabled": false,
        "notes": ""
    },
    "other": {
        "name": "Other",
        "enabled": false,
        "notes": ""
    }
}

const sampleAuthorizations = {
    "hiv": {
        "name": "HIV test results",
        "value": false
    },
    "alcoholAndDrug": {
        "name": "Alcohol and Drug Abuse Records",
        "value": false
    },
    "mentalHealth": {
        "name": "Details of Mental Health Diagnosis and/or Treatment",
        "value": false
    },
    "confidential": {
        "name": "Confidential Communications with a Licensed Social Worker",
        "value": false
    },
    "domesticViolence": {
        "name": "Details of Domestic Violence Victims Counseling",
        "value": false
    },
    "sexualAssault": {
        "name": "Details of Sexual Assault Counseling",
        "value": false
    },
    "genetic": {
        "name": "Genetic Screening",
        "value": false
    },
    "other": {
        "name": "Other(s)",
        "value": false
    }
}

const sampleManifest = {
    "transactionTime": "2023-06-15T14:33:59.289Z",
    "requiresAccessToken": true,
    "output": [
        {
            "type": "Patient",
            "url": "http://127.0.0.1:8888/jobs/20d563d4b2065d87/download/Patient",
            "count": 1
        },
        {
            "type": "Organization",
            "url": "http://127.0.0.1:8888/jobs/20d563d4b2065d87/download/Organization",
            "count": 3
        },
        {
            "type": "Practitioner",
            "url": "http://127.0.0.1:8888/jobs/20d563d4b2065d87/download/Practitioner",
            "count": 3
        },
        {
            "type": "Observation",
            "url": "http://127.0.0.1:8888/jobs/20d563d4b2065d87/download/Observation",
            "count": 66
        },
        // {
        //     "type": "DocumentReference",
        //     "url": "http://127.0.0.1:3000/jobs/3/download/DocumentReference",
        //     "count": 4
        // }
    ],
    "error": [],
    "extension": {
        "metadata": "http://127.0.0.1:8888/jobs/20d563d4b2065d87/metadata"
    }
}

export async function seed(): Promise<void> {

    // users -------------------------------------------------------------------
    await promise("run", `DROP TABLE IF EXISTS "users"`)

    await promise("run", `
        CREATE TABLE "users" (
            "id"        Integer NOT NULL PRIMARY KEY AutoIncrement,
            "username"  Text    NOT NULL,
            "password"  Text    NOT NULL,
            "role"      Text    NOT NULL,
            "lastLogin" DateTime,
            "sid"       Text,
            "session"   Text
        )`
    );

    await promise("run",
        "INSERT INTO users (username,password,role) values ('admin', ?, 'admin')",
        Bcrypt.hashSync('admin-password', config.salt)
    );

    await promise("run",
        "INSERT INTO users (username,password,role) values ('patient', ?, 'user')",
        Bcrypt.hashSync('patient-password', config.salt)
    );

    // Institutions ------------------------------------------------------------
    await promise("run", `DROP TABLE IF EXISTS "institutions"`)

    await promise("run", `
        CREATE TABLE "institutions" (
            "id"          Integer NOT NULL PRIMARY KEY AutoIncrement,
            "displayName" Text    NOT NULL,
            "fhirUrl"     Text,
            "location"    Text,
            "disabled"    Boolean,
            "clientId"    Text NOT NULL,
            "scope"       Text NOT NULL
        )`
    );

    await promise("run",
        `INSERT INTO institutions values (?, ?, ?, ?, ?, ?, ?)`,
        [
            1,
            "New York Gerontology Hospital",
            "https://ehi-server.herokuapp.com/fhir",
            "211 Shortsteel Blvd New York, NY 10001",
            0,
            "test_client_id",
            "offline_access patient/$ehi-export"
        ]
    );

    await promise("run",
        `INSERT INTO institutions values (?, ?, ?, ?, ?, ?, ?)`,
        [
            2,
            "Local EHI server at 127.0.0.1:8888",
            "http://127.0.0.1:8888/fhir",
            "211 Shortsteel Blvd New York, NY 10001",
            0,
            "test_client_id",
            "offline_access patient/$ehi-export"
        ]
    );

    await promise("run",
        `INSERT INTO institutions values (?, ?, ?, ?, ?, ?, ?)`,
        [
            null,
            "Fana Darber",
            "http://example.com/fhir",
            null,
            1,
            "test_client_id",
            "offline_access patient/$ehi-export"
        ]
    );

    await promise("run",
        `INSERT INTO institutions values (?, ?, ?, ?, ?, ?, ?)`,
        [
            null,
            "Journey Assessments",
            "http://example.com/fhir",
            null,
            1,
            "test_client_id",
            "offline_access patient/$ehi-export"
        ]
    );

    await promise("run",
        `INSERT INTO institutions values (?, ?, ?, ?, ?, ?, ?)`,
        [
            null,
            "Billows Medicine",
            "http://example.com/fhir",
            null,
            1,
            "test_client_id",
            "offline_access patient/$ehi-export"
        ]
    );

    await promise("run",
        `INSERT INTO institutions values (?, ?, ?, ?, ?, ?, ?)`,
        [
            null,
            "Gram Typical Young Health",
            "http://example.com/fhir",
            null,
            1,
            "test_client_id",
            "offline_access patient/$ehi-export"
        ]
    );

    // Create jobs table -------------------------------------------------------
    await promise("run", `DROP TABLE IF EXISTS "jobs"`)

    await promise("run", `
        CREATE TABLE "jobs" (
            "id"             Integer  NOT NULL PRIMARY KEY AutoIncrement,
            "userId"         Integer  NOT NULL,
            "patientId"      Integer  NOT NULL,
            "statusUrl"      Text     NOT NULL,
            "readonly"       Boolean DEFAULT 0,
            "customizeUrl"   Text,
            "manifest"       Text,
            "parameters"     Text,
            "authorizations" Text,
            "attachments"    Text,
            "createdAt"      DateTime DEFAULT CURRENT_TIMESTAMP,
            "accessToken"    Text NOT NULL,
            "refreshToken"   Text NOT NULL,
            "tokenUri"       Text NOT NULL,
            "status"         Text,
            "patientName"    Text
        )`
    );

    // Insert some read-only jobs ----------------------------------------------
    await promise(
        "run",
        `INSERT INTO "jobs" (
            id,
            userId,
            patientId,
            statusUrl,
            readonly,
            customizeUrl,
            manifest,
            parameters,
            authorizations,
            attachments,
            accessToken,
            refreshToken,
            tokenUri,
            status,
            patientName
        ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            1,    // id
            1,    // userId (admin)
            "sample_patient_id", // patientId
            "",   // statusUrl
            1,    // readonly
            "",   // customizeUrl
            JSON.stringify(sampleManifest),       // manifest
            JSON.stringify(sampleParameters),     // parameters
            JSON.stringify(sampleAuthorizations), // authorizations
            JSON.stringify([]), // attachments
            "",          // accessToken
            "",          // refreshToken
            "",          // tokenUri
            "in-review", // status
            ""           // patientName
        ]
    );

    await promise(
        "run",
        `INSERT INTO "jobs" (
            id,
            userId,
            patientId,
            statusUrl,
            readonly,
            customizeUrl,
            manifest,
            parameters,
            authorizations,
            attachments,
            accessToken,
            refreshToken,
            tokenUri,
            status,
            patientName
        ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            2,    // id
            2,    // userId (patient)
            "sample_patient_id", // patientId
            "",   // statusUrl
            1,    // readonly
            "",   // customizeUrl
            JSON.stringify(sampleManifest),       // manifest
            JSON.stringify(sampleParameters),     // parameters
            JSON.stringify(sampleAuthorizations), // authorizations
            JSON.stringify([]), // attachments
            "",          // accessToken
            "",          // refreshToken
            "",          // tokenUri
            "in-review", // status
            ""           // patientName
        ]
    );
}

async function main(): Promise<DB> {
    if (!mainPromise) {
        mainPromise = seed()
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

function cleanup() {
    const base = join(__dirname, "jobs")
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
