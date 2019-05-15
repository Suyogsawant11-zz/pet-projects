import * as React from 'react';
import ws from '../utils/websockets';
import * as moment from 'moment'

const STOCK_FETCHING_URL = 'ws://stocks.mnet.website'
const STATUS = {
  UP:'UP',
  DOWN:'DOWN',
  DEFAULT:'DEFAULT',
}
const STATUS_TO_CLASS_MAP = {
  UP:{ class:'success' },
  DOWN:{ class:'danger' },
  DEFAULT:{ class:'active' },
}

class App extends React.Component<any, any> {

  private _updateLastUpdatedStatus:any

  constructor(props){
    super(props)
    
    this.state = {
      isLoading:true,
      connectionFormed:false,
      markets:[],
    }

    // opening connection   
    ws.setConnection(STOCK_FETCHING_URL)
    ws.onOpen(this.onHandshake.bind(this))
    ws.onMessage(this.handleMarketData.bind(this))
  }

  onHandshake(){
    this.setState({ connectionFormed:true })
  }

  removeDuplicates(data):any{
    let filteredData = {}
      
      data.forEach(d => {
        !filteredData[d[0]] && (filteredData[d[0]] = d)
      })

    return [...Object.values(filteredData)]
  }

  handleMarketData(data){

    // This is totlay uncessary - but we are receiving duplicate copies of data with same name, so filtering it out, in case of clean data we can avoid calling this function totally
    let marketData = this.removeDuplicates(data)
    let newData = [] // New enrteis will get pushed 
    let { markets } = this.state

    marketData.forEach((freshData)=>{
      // destructuring new received data into Name and its price
      let [stockOf, price] = freshData
      let roundedPrice = +price.toFixed(2)
      
      // Set default state of newly received data
      let dataToPush = { 
          stockOf,
          price:roundedPrice,
          status:STATUS.DEFAULT,
          updated:{ time:moment(), display: null }
        }

      // Cross-check if its already in existing one's 
      let filteredIndex = markets.findIndex((data)=> stockOf === data.stockOf )

      if(filteredIndex>-1){
        // If exist then pop it out from state data
        let filteredData = markets[filteredIndex]
        let status = filteredData.status,
            updated = filteredData.updated

          // updates its state of price in comparision from previous ones along with new set of current updated status
          if(price!==filteredData.price){
            status = price>filteredData.price?STATUS.UP:STATUS.DOWN
            updated = {
              time:moment(),
            }
          }

          markets[filteredIndex] = {
            ...filteredData,
            price:roundedPrice,
            status,
            updated,
          }
        
        return
      }
      
      newData.push(dataToPush)

    })

    if(this._updateLastUpdatedStatus){
      clearInterval(this._updateLastUpdatedStatus)
      this._updateLastUpdatedStatus = null
    }

    this.updateMarketData([...markets, ...newData])
  }

  updateMarketData(data){

    let updatedMarketData = this.updateLastUpdateTime(data)

    this.setState({ markets:updatedMarketData },()=>{
      
      // Case where we don not receive any udpates from server - still we will handle last updated time of stocks
      if(!this._updateLastUpdatedStatus){
        
        this._updateLastUpdatedStatus = setInterval(()=>{
          this.updateMarketData(this.state.markets)
        },60000)
      }

    })
  }

  updateLastUpdateTime=(marketData)=>{
    return marketData.map((data)=>{
      return {
          ...data,
          updated:{
            ...data.updated,
            display:data.updated.time.fromNow(),
          }
        }
    })
  }

  getStockRows(){
    let { markets } = this.state

    return markets.map((row,index)=>{
      return (
        <tr className={STATUS_TO_CLASS_MAP[row.status]['class']} key={index}>
          <td>{row.stockOf}</td>
          <td>{row.price}</td>
          <td>{row.updated.display}</td>
        </tr>
      )
    })
  }

  render() {
    let stockRows = this.getStockRows()
    return (
      <div>
          <table className="table table-hover" > 
          <thead>
            <tr>
              <th>Symbol</th>
              <th>LTP</th>
              <th>last updated</th>
            </tr>
          </thead>
            <tbody>{stockRows}</tbody>
          </table>
      </div>
    );
  }
}

export default App;
