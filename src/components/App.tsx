import * as React from 'react';
import ws from '../utils/websockets';
import * as moment from 'moment'
import '../static/css/app.css'

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
    
    let { markets } = this.state
    
    let newData = marketData.map((freshData)=>{
      // destructuring new received data into Name and its price
      let [stockOf, price] = freshData
      let roundedPrice = price.toFixed(2)
      
      // Set default state of newly received data
      let dataToPush = { 
          stockOf,
          price:roundedPrice,
          status:STATUS.DEFAULT,
          updated:{ time:moment(), display: moment().fromNow() }
        }

      // Cross-check if its already in existing one's 
      let filteredIndex = markets.findIndex((data)=> stockOf === data.stockOf )

      if(filteredIndex>-1){
        // If exist then pop it out from state data
        let filteredData = markets.splice(filteredIndex,1)[0]
        let status = filteredData.status,
            updated = filteredData.updated

          // updates its state of price in comparision from previous ones along with new set of current updated status
          if(price!==filteredData.price){
            status = price>filteredData.price?STATUS.UP:STATUS.DOWN
            updated = {
              display:moment(filteredData.updated.time).fromNow(),
              time:moment(),
            }
          }

        dataToPush = {
          ...filteredData,
          price:roundedPrice,
          status,
          updated,
        }
      }

      return dataToPush

    })

    markets = markets.map(d=>{
      return  {
          ...d,
          updated:{
            ...d.updated,
            display:d.updated.time.fromNow(),
          }
        }
    })

    let sortedMarketData = this.sortMarketData([...markets, ...newData])

    this.setState({ markets:sortedMarketData })
  }

  sortMarketData(data){
    return data.sort((data1,data2)=>{
      if(data1.price < data2.price) return -1

      if(data1.price > data2.price) return 1
      
      return 0
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
              <th>Name</th>
              <th>Price</th>
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
