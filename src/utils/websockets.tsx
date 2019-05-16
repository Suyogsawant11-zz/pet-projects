
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
            cb & cb( JSON.parse(res.data || {}))
        }
    },
    onError:(cb?:any)=>{
        ws.onerror = (error:string)=>{
            cb & cb(error)
        }
    },
}