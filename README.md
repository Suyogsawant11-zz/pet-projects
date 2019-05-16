# Stocks App

This App is developed by using React along with Typescript and Websockets.
Its displays live stock exchange data with detail information along with price update in sparlines.

Key points:
1. Have completely seperate out websocket methods into different independent util so that it can get re-used in other projects too.
2. Error handling incase of Websocket raises error - is handled by React-ErrorBoundary
3. HOC is used to handle loading state of Stock Table, as its even a recommended way
4. React-sparlines is used for handling sparlines
5. Moment.js is used to handle last update time of received data
6. Bootstartap us used for markup/style prupose (there are lot of better options apart from this)
7. Background color is handled as Red or Green as per price fall or rise of stocks
8. Hot reloading - increases development time


App displays detail information of received stocks data:
1. Symbol - name of stock
2. LTP - last traded price	
3. Open - open on which price (first received price is used)	
4. High - highest price compare to received data	
5. Low	- lowest price compare to received data	
6. Change - difference in amounts of newly received data along with past last udpated data
7. Change(%) -	change difference in percentage
8. Today - specified last updated time

To run the project following things is required in local:
node, npm, yarn

Run yarn and after all dependencies get resolved run yarn start (it will start development server with Hot reloading)
