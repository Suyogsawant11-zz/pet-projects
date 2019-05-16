

const dummyData = [
    ["lnkd",101.91]
   ,["mu",146.07]
   ,["goog",146.99]
   ,["tck",155.55]
   ,["eva",168.10]
   ,["msft",188.07]
   ,["yhoo",197.68]
   ,["shld",33.48]
   ,["evi",45.46]
   ,["aks",52.84]
   ,["aapl",66.87]
   ,["ebr",70.25]
   ,["intc",83.02]
]
const websocket:any = window['WebSocket']

let ws:any = null
var f = 0
export default {
    setConnection:(URL:string)=>{
        ws = new websocket(URL)
    },
    onOpen:(cb?:any)=>{
        ws.onopen = ()=>{
            cb & cb()
        }
    },
    onClose:(cb?:any)=>{
        ws.onclose = ()=>{
            cb & cb()
        }
    },
    onMessage:(cb?:any)=>{
        ws.onmessage = (res:any)=>{
            // // cb(dummyData)
            // f++
            // f==2 && ws.close()
            cb & cb( JSON.parse(res.data || {}))
        }
    },
    onError:(cb?:any)=>{
        ws.onerror = (error:string)=>{
            cb & cb(error)
        }
    },
}