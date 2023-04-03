import Client from "fhirclient/lib/Client"

declare namespace App {

    interface FhirClientContext {
        client?: Client
        error ?: Error
    }
}

export = App
// export as namespace App
