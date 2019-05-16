
export const STOCKS_FETCHING_URL = 'ws://stocks.mnet.website'

export const STATUS = {
  UP:'UP',
  DOWN:'DOWN',
  DEFAULT:'DEFAULT',
}

export const STATUS_TO_CLASS_MAP = {
  UP:{ class:'table-success' },
  DOWN:{ class:'table-danger' },
  DEFAULT:{ class:'table-light' },
}

export const SPARK_LINES_OF_STACK = 15  // sparklines will get rendered based on last N number of updations

export const MOMENT_CUSTOMIZAITON = {
    calendar : {
        lastDay : 'd MMM LT',
        sameDay : ' LT',
        lastWeek : 'd MMM LT',
        sameElse : 'd MMM LT'
    }
}

export const TABLE_HEADERS = [
  'Symbol',
  'LTP',
  'Open',
  'High',
  'Low',
  'Change',
  'Change (%)',
  'Today',
  'last updated',
]

export const WS_MESSAGES = {
  connectionFormed:'Connection established',
  error:'Error occured in Websocket connection',
}