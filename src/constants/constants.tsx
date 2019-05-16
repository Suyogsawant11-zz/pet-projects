
export const STOCKS_FETCHING_URL = 'ws://stocks.mnet.website'

export const STATUS = {
  UP:'UP',
  DOWN:'DOWN',
  DEFAULT:'DEFAULT',
}

export const STATUS_TO_CLASS_MAP = {
  UP:{ class:'success' },
  DOWN:{ class:'danger' },
  DEFAULT:{ class:'active' },
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