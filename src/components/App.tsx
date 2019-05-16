import * as React from 'react';
import ws from '../utils/websockets';

// Moment import + custom config for calendar
import * as moment from 'moment'
  moment.locale('en', {
    calendar : {
        lastDay : 'd MMM LT',
        sameDay : ' LT',
        lastWeek : 'd MMM LT',
        sameElse : 'd MMM LT'
    }
  });

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
      let [stockOf, rawPrice] = freshData
      let roundedPrice = +rawPrice.toFixed(2)
      
      // Set default state of newly received data
      let dataToPush = { 
          stockOf,
          price:{
            current:roundedPrice,
            open:roundedPrice,
            low:roundedPrice,
            high:null,
            change:0, changeInPercent:0,
          },
          status:STATUS.DEFAULT,
          updated:{ time:moment(), display: null }
        }

      // Cross-check if its already in existing one's 
      let filteredIndex = markets.findIndex((data)=> stockOf === data.stockOf )

      if(filteredIndex>-1){
        // If exist then pop it out from state data
        let filteredData = markets[filteredIndex]
        let {status, updated, price} = filteredData

          // updates its state of price in comparision from previous ones along with new set of current updated status
          if(roundedPrice!==price.current){
            status = roundedPrice>price.current? STATUS.UP : STATUS.DOWN

            markets[filteredIndex] = {
              ...filteredData,
              price:{
                ...this.handlePricingData(roundedPrice,price),  // Get updated price of data 
              },
              status,
              updated:{
                ...updated,
                time:moment(),
              },
            }
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

  // Will take care of Pricing update
  handlePricingData(currentPrice, price){
    
    let { current, low, high } = price, change, changeInPercent,divider 

    low = low<=currentPrice? low : currentPrice
    high = high>currentPrice? high : currentPrice
    
    // Change in range and percentage as compared last update value
    change = +(currentPrice-current).toFixed(2)
    divider = current

    changeInPercent = +((change/divider)*100).toFixed(2)

    return {
      ...price,
      current:currentPrice, low, high, change, changeInPercent
    }
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

      let t=moment(),
          pd=data.updated.time,
          timeDiff = t.diff(pd,'minutes'),
          display = pd.fromNow()
        
        if(timeDiff){
          display = pd.calendar()

        }

      return {
          ...data,
          updated:{
            ...data.updated,
            display,
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
          <td>{row.price.current}</td>
          <td>{row.price.open}</td>
          <td>{row.price.high}</td>
          <td>{row.price.low}</td>
          <td>{row.price.change}</td>
          <td>{`${row.price.changeInPercent} %`}</td>
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
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Change</th>
              <th>Change  (%)</th>
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
