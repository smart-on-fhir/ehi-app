import { useEffect }from "react"
import { useSMART } from "../context"

export default function Launcher() {
    const { startAuthorization } = useSMART()

    useEffect(() => {
        startAuthorization()
    }, [])

    return <b>Launching...</b>
}