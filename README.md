# TD365
> Only Test/Sandbox APIs

Recently, we undertook a project related to trading. The requirements were straightforward: the client wanted a personalized trading terminal containing a limited set of trading items to be traded across multiple accounts. They wished to operate multiple trading accounts from this customized terminal. Additionally, they required the terminal to execute the same trade order simultaneously across all of the trading accounts they had saved.

### Challenges:
Managing trading accounts can be tricky, especially on platforms where anonymous traders engage in item trading. These platforms are quick to suspend accounts if any form of misuse is detected. Unfortunately, the platform did not provide any APIs for creating a program that interacts with it. Therefore, we had to find a solution on our own.

### First approach:
Our initial approach was to automate trading using a browser automation tool, aiming to avoid detection. However, this method did not yield satisfactory results. We encountered issues related to trade order placement, particularly due to problems with XPath caused by the platform's anti-bot measures. Even after circumventing these anti-bot measures, we struggled with response times. Placing a single trade order took around 2-3 seconds or even longer, which naturally left the client dissatisfied.

At this point, we decided to explore more unconventional methods.

### Second approach:
We began to closely monitor the network requests made by the platform and identified some REST API endpoints. However, security measures were stringent.

To place a trade order, specific values were required, but the source of these values remained elusive. Each order necessitated the current price of the item, and while we attempted to use the private API with the visible values from the platform, our efforts were in vain. The platform employed a unique key parameter for all orders, and initially, this parameter's purpose eluded us. Undeterred, we combined the price retrieval mechanism from a WebSocket API we discovered on the platform with the private API to execute orders at the actual price. Unfortunately, this too did not yield success.

After another half-hour of searching, we successfully located the elusive key. Astonishingly, it had been right in front of us the entire time!

Finally, we managed to place trade orders within a mere 100 milliseconds!

### Which approach did we ultimately adopt?
Let's keep that as our little secret.

### What did we learn from this experience?
We gleaned invaluable insights, from bypassing new anti-bot strategies to accessing private APIs.
Most importantly, we thoroughly enjoyed the entire process!

