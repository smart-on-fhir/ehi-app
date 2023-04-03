import { useEffect } from "react";
import { useSMART }  from "../../context"
import "./App.css"


export default function App() {
    const SMART = useSMART()

    const { completeAuthorization, client } = SMART

    useEffect(() => { completeAuthorization() }, [])

    async function ehiExport() {
        const { response } = await client?.request({
            url: `/Patient/${client.getPatientId()}/$ehi-export`,
            method: "POST",
            includeResponse: true
        })

        const link = response.headers.get("Link")

        if (link) {
            console.log("=>", link)
            const [href, rel] = link.split(/\s*;\s*/)
            console.log(href, rel)
            if (href && rel === 'rel="patient-interaction"') {
                window.location.href = href
            }
        }
    }

    return (
        <>
            <button onClick={ehiExport}>Export</button>
            <pre>{ JSON.stringify(SMART, null, 4) }</pre>
        </>
    );
}
