import * as React from 'react';
import {
  STOCKS_FETCHING_URL,
  STATUS, 
  SPARK_LINES_OF_STACK, 
  MOMENT_CUSTOMIZAITON, 
  WS_MESSAGES,
} from '../constants/constants'
import ws from '../utils/websockets';
import StockTable from './StockTable'
import {IState, IReceivedRawDataChunk, IMarket, IPrice} from '../InterfacePool'

// Moment import + custom config for calendar
import * as moment from 'moment'
  moment.locale('en', MOMENT_CUSTOMIZAITON);
  
class App extends React.Component<any, IState> {

  private _updateLastUpdatedStatus:any|null

  constructor(props){
    super(props)
    
    this.state = {
      isLoading:true,
      connectionFormed:false,
      markets:[],
    }

    // opening connection   
    ws.setConnection(STOCKS_FETCHING_URL)
    ws.onOpen(this.onHandshake.bind(this))
    ws.onMessage(this.handleMarketData.bind(this))
    ws.onError(this.handleError.bind(this))
  }

  handleError():void{
    throw new Error(WS_MESSAGES.error)
  }

  onHandshake():void{
    this.setState({ connectionFormed:true })
  }

  removeDuplicates(data:IReceivedRawDataChunk[]):any[]{
    let filteredData = {}
      
      data.forEach(d => {
        !filteredData[d[0]] && (filteredData[d[0]] = d)
      })

    return [...Object.values(filteredData)]
  }

  handleMarketData(data:IReceivedRawDataChunk[]):void{

    // This is totally uncessary - but we are receiving duplicate copies of data with same name, so filtering it out, in case of clean data we can avoid calling this function totally
    let marketData = this.removeDuplicates(data)
    let newData = [] // New entries will get pushed 
    let { markets } = this.state

    marketData.forEach((freshData:IReceivedRawDataChunk)=>{
      // destructuring new received data into Name and its Raw-price
      let [symbol, rawPrice] = freshData
      let roundedPrice = +rawPrice.toFixed(2)
      
      // Set default state of newly received data
      let dataToPush = { 
          symbol,
          price:{
            current:roundedPrice,
            open:roundedPrice,
            low:roundedPrice,
            high:null,
            change:0, changeInPercent:0,
            stack:[roundedPrice],
          },
          status:STATUS.DEFAULT,
          updated:{ time:moment(), display: null }
        }

      // Cross-check if its already in existing one's 
      let filteredIndex = markets.findIndex((data:IMarket)=> symbol === data.symbol )

      if(filteredIndex>-1){
        // If exist then pop it out from state data
        let filteredData = markets[filteredIndex]
        let {status, updated, price} = filteredData

          // updates its state of price in comparision from previous ones along with new set of current updated status
          if(roundedPrice!== price.current){
            status = roundedPrice> price.current? STATUS.UP : STATUS.DOWN

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

          // Push newData to stack for SparkLines
          markets[filteredIndex] = this.updateDatForSparLine(roundedPrice,markets[filteredIndex])
          
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

  updateDatForSparLine=(newPrice:number,marketData:IMarket):IMarket=>{
  
    let {stack} = marketData.price

      stack.push(newPrice)

    return {
      ...marketData,
      price:{
        ...marketData.price,
        stack:stack.splice(-SPARK_LINES_OF_STACK),
      }
    }

  }

  // Will take care of Pricing update
  handlePricingData(currentPrice:number, price:IPrice):IPrice{
    
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

  updateMarketData(data:IMarket[]):void{

    let updatedMarketData = this.updateLastUpdateTime(data)

    this.setState({ markets:updatedMarketData, isLoading:false },()=>{
      
      // Case where we do not receive any udpates from server - still we will handle last updated time of stocks
      if(!this._updateLastUpdatedStatus){
        
        this._updateLastUpdatedStatus = setInterval(()=>{
          this.updateMarketData(this.state.markets)
        },60000)
      }

    })
  }

  updateLastUpdateTime=(marketData:IMarket[]):IMarket[]=>{
    return marketData.map((data:IMarket):IMarket=>{

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

  render() {
    let { markets, isLoading, connectionFormed } = this.state
   
    return (
      <div className="card">
        <h5 className="card-header">Stocks App</h5>
        {connectionFormed && isLoading && (<div className="card-body">{WS_MESSAGES.connectionFormed}</div>)}
        <div className="card-body">
          <StockTable marketData={markets} isLoading={isLoading} />
        </div>
      </div>
    );
  }
}

export default App;
