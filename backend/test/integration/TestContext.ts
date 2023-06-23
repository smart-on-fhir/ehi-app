import { existsSync } from "fs";
import { unlink } from "fs/promises";
import { AddressInfo, Server } from "net"
import { join } from "path";
import server from "../.."
import config from "../../config"
import db from "../../db"




let testServer: Server | null

export const SERVER = {
    baseUrl: "",
    start() {
        return new Promise(resolve => {
            testServer = server.listen(0, "127.0.0.1", () => {
                const address = testServer!.address() as AddressInfo
                this.baseUrl = "http://127.0.0.1:" + address.port
                console.log(`Test server listening at ${this.baseUrl}`)
                resolve(this)
            })
        })
    },
    stop() {
        return new Promise((resolve, reject) => {
            if (testServer && testServer.listening) {
                testServer.close(error => {
                    if (error) {
                        reject(error)
                    } else {
                        console.log(`Test server stopped`)
                        resolve(this)
                    }
                })
            } else {
                resolve(this)
            }
        })
    }
};

export async function dropDb() {
    const path = join(__dirname, "../../../", config.db)
    if (existsSync(path)) {
        return unlink(path)
    }
    return false
}


async function up() {
    await SERVER.start()
}

async function down() {
    await SERVER.stop()
}


before(up);
after(down);
beforeEach(db.init);
