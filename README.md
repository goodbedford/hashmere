# Hashmere - A social media aggregation application
1st student project for General Assembly WDI 19/20 cohort. 

Hashmere is an application to search across social media using hashtags and view aggregated results on one page. Users can access, post, and curate their content and shape their social media presence.

[Live here!](https://hashmere.herokuapp.com/)

### Documentation
#### Technology
Application was built via JavaScript fullstack.
Front-end:
- jQuery
- Bootstrap
- underscore.js
- Twitter widgets
- google fonts

Back-end:
- node.js
- mongo/mongoose
- twitter SEARCH API

#### Check it out!
If you would like to test the application locally, feel free to clone!
```
$git clone https://github.com/henry-yi/hashmere.git
$cd hashmere
```

Create a .env file and populate:
```
consumerKey=TWITTER_API_KEY
consumerSecret=TWITTER_API_SECRET
SESSION_KEY=YOUR_SESSION_SECRET
```

Install dependent node packages. Notable mentions are for mtwitter to make application-based requests to Twitter's API.
```
$npm install
```

Run mongo servers, and start local server! Default port is 3000.
```
$mongod

//in new terminal window:
$nodemon
```

In your browser, go to http://localhost:3000

Thanks and enjoy [Hashmere!](https://hashmere.herokuapp.com/)



