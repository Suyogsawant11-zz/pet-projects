import { Moment } from "moment";

export type IReceivedRawDataChunk = [string,number]

export type IPrice = {
    current:number
    open:number
    low:number
    high:number|null
    change:number
    changeInPercent:number
    stack:number[]
}

export type IMarket = {
    symbol:string
    price:IPrice
    status:string,
    updated:{
        time:Moment,
        display:string
    },
}

export interface IState {
    isLoading:boolean
    connectionFormed:boolean
    markets?: IMarket[]
}