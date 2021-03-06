## Setup

```
# Seed you database with restaurant data.
Restaurant.import_from_zomato("Chennai")

# Update the bounds of the city.
City.find_by_name("Chennai").update(:bounds => "12.7847499:80.070000,13.2032924:80.29606948")

# Index your database.
LocationIndex.index(1).

# Perform fastest nearest search queries.
LocationIndex.fastest_nearest_search([13.20,80.20])
# This query will return all the restaurants around the given latitude and longitude.
```

## Idea and Implementation

Fastest nearest neighbor search algorithm was implemented over a sample set of all the restaurants in Chennai. Restaurant information was incrementally gathered from zomato.com's public API. This API provides basic information of about 800 restaurants in Chennai. Information like, cuisines served, address, rating (etc). Once this was obtained, the Google GEO Coding public API was used to map each restaurant address into a latitude and longitude metric. The Rails-Angular application modularizes this process through a defined data dump job which is to be run before the development environment is setup.
As per the theory of the fastest nearest neighbor search, the search area was mapped into smaller spatial regions, and restaurants were indexed based on their proximity to the zones. 
A four step search algorithm was implemented using the spatial indexes.

### Location Search Algorithm 

The search algorithm takes in a latitude, longitude and additional tags like "Italian", "North Indian" etc. which are used as additional filters.

1)  It maps the latitude and longitude to the spatial zone to which it belongs to, and returns a list of restaurants in that zone.

2)  It then looks for restaurants in adjacent spatial zones, and returns a list of restaurants in each of the nearby zone.

If step one and step two return restaurants whose count is more than a defined critical count, the algorithm stops else it continues.

3) If step one and step two return no results, the algorithm looks for all the restaurants in the same city.

4) If even step three returns an empty result, the algorithm returns all the restaurants in the database limited to a defined count and ordered by a defined property.

Based on this search algorithm a Rails-Angular application called 'Chennai Foodie' was built, which enabled users to locate restaurants near their current location.

The application uses the phone's location via the HTML5 geo-location API and fetches the restaurants in and around the user. The user can additionally specify Cuisines (tags) to filter his/her result further.

As an enhancement, a free text search algorithm was also implemented which responds to queries like "Find me an Italian restaurant in Adyar" or "Get me all the restaurants near Guindy".

### Free text search Algorithm 

The text query is split into words. The algorithm loops through each word and compares it to a set of locality names, and cuisines name and compute a SQL query.Example: "Find me an Italian restaurant in Adyar" would result in a query like -> `select * from restaurants where cuisines in ['Adyar'] and locality in ['Guindy']`

A twitter bot was built based on both the algorithms. To ensure complete mobile accessibility, without manually installing an application on a mobile device, and user can tweet with the phrase "#ChennaiFoodie".

The twitter bot listens to Twitter's live stream and responds with custom messages. Example: A user tweets "I am hungry #ChennaiFoodie", the bot will respond with "Hey, @user I've found 10 places near you. I suggest Little Italy."

The twitter server which runs independently form the ruby app, communicates queries to the app via a well defined Restful interface.

It's to be noted that the entire system was built and architected using the TDD and is completely spec covered.



