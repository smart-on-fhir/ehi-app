import React                    from 'react'
import ReactDOM                 from 'react-dom/client'
import { Route, BrowserRouter } from 'react-router-dom'
import { Routes }               from 'react-router'
import App                      from './components/App'
import Launcher                 from './components/Launcher'
import { SMARTProvider }        from './context'


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <SMARTProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/launch" element={ <Launcher /> } />
                    <Route path="/" element={ <App /> } />
                    <Route element={ <b>Not Found</b> } />
                </Routes>
            </BrowserRouter>
        </SMARTProvider>
    </React.StrictMode>
)
