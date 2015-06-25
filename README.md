# Practice REST operations
*Author: Ikrum Hossain (ikrum.bd@gmail.com)*

This is an offline practice application where newbies can learn REST operations. For demonstration a dummy contact app has been implemented. You can also download the real REST api and Android app from [REST-in-SlimFramework](https://github.com/ikrum/REST-in-SlimFramework)


###### REST-Explorer Demo : http://apikothon.com/demo/REST-Explorer/

### What you can learn from here
* Resource / URL format
* How HTTP Methods in action
* Inspect Request and Response
* HTTP status code and error design
* Data representation for client


## Instruction
1.	Fork and clone this repository or you can download the zip as well
2.	Open the index.html
3.	[Optional] Click on example tab to see the resources and operations.
4.	Enter the resource URI on the input box, select the method and send the request.
5.	Now analyze the request, response and contact preview for every request.

## Screenshot
![ScreenShot](https://raw.githubusercontent.com/ikrum/Practice-REST/master/screenshot.PNG)



## Contribution
You can contribute to improve the feature and make it more useful for beginners.
Add more resources at `main.js` like
```javascript
  var appRouter = new Router();
  //appRouter.addRoute( METHOD, URI, FUNCTION )
  appRouter.addRoute("GET",	"/api/contacts","getAllContacts");
```
