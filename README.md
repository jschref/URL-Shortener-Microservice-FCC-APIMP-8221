# URL Shortener Microservice 8.2.21
This project was completed as part of the Free Code Camp APIs and Microservices course.

[Project info](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice)

[My FCC Profile](https://www.freecodecamp.org/jschref)

## My outline for building this:
1) create a schema to store the data

2) create some sort of input function to deal with POST requests to add new abridged URLs to the database 

3) the input function should first call an input checker/sanitizer. (chunk things out for modularity)

4) Create a request handler which checks incoming requests and, if they are valid, redirects to the stored original URL, and if they aren't displays some sort of error message. 

### Thought process re. values for the shortened URL: 
I need a way to create a shortened URL value. This random value generator may increment a counter, or may call the database to find out the last number generated, or may generate a random number and then check it against the database. Each of these strategies has pros and cons.
- Incrementer is super simple, but is dependent on state to be maintained, every time the server restarts you'd start counting all over again and you'd scrub your old shortened URL entries. 
- Incrementer based on the database wouldn't be difficult to implement, and wouldn't be dependent on the app's state, but it'd mean URLs wouldn't be "secret," someone could easily write a script to scrub through the API and get everyone's shortened URLs, and even take an educated guess at when they created them. 
- Fully random number generator would have the benefit of better security, but you'd need to run through the database to confirm the value hadn't been used before, or risk unexpected behaviors. With a few URLs that'd be no big deal, but how well would that scale with a huge number of stored URLs? 
- on top of all this, how short exactly should the short URL be, how relevant is security, and how do you handle multiple identical URLs? The example given wants a 12 character URL shortened. Cutting that to just 6 numbers is only 10^6 possibilities, hardly secure. Expanding that to letters and numbers creates a more reasonable 36^6 possibilities. Even that though, if you assume no flood controls and 10,000 requests per second (I have no idea how high or low that is for MongoDB, facebook is over 10 million requests per second) that'd only be 2.5 days for a script to scrub through ALL the possibilities. And all this sits on top of the glaring problem which is: the replit project URL is already monstrously long, 62 characters before you've even added the ID to the end.
- finally, what should you do if the same URL is input twice? Provide the original number (having searched the entire database) revealing to the user that value has been entered before and roughly when? (assuming the shortened values are ordered), or create a new database entry? There is the same scalability question of searching the whole database for a matching URL, and then of course there is the privacy issue. 
- CONCLUSION - There is no plausible functionality to this project beyond education, the base URLs will be vastly too long to actually streamline anything. MongoDB comes with its own clever random never-repeating (within a schema) value generator baked it, it assigns it as an ID to every entry. It is a 24 character hex string, and presumably is an efficient way to search the database. It is long enough it should provide some vague measure of security (especially if you don't know how MongoDB IDs are generated), and saves a lot of work creating a function which has no real other use. 

