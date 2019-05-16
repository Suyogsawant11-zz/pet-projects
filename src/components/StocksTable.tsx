import * as React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import {
    STATUS_TO_CLASS_MAP,
    TABLE_HEADERS
} from '../constants/constants'
import Loading from './Loading'

function getHeader():JSX.Element[]{
    return TABLE_HEADERS.map((headerTitle:string,index:number)=><th key={index} >{headerTitle}</th>)
}

function getRows(markets):JSX.Element[]{

    return markets.map((row,index)=>{
      return (
        <tr className={STATUS_TO_CLASS_MAP[row.status]['class']} key={index}>
          <td>{row.symbol}</td>
          <td>{row.price.current}</td>
          <td>{row.price.open}</td>
          <td>{row.price.high}</td>
          <td>{row.price.low}</td>
          <td>{row.price.change}</td>
          <td>{`${row.price.changeInPercent} %`}</td>
          <td>
            <Sparklines data={row.price.stack} >
                <SparklinesLine style={{ strokeWidth: 3, stroke: "#336aff", fill: "none" }} />
            </Sparklines>
          </td>
          <td>{row.updated.display}</td>
        </tr>
      )
    })
  }

function StocksTable({marketData}){

    let stockRows = getRows(marketData)
    let headers = getHeader()

    return (
      <table className="table" > 
        <thead >
          <tr>{headers}</tr>
        </thead>
        <tbody>{stockRows}</tbody>
      </table>
    )
}


export default Loading(StocksTable)