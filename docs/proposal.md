# Genre Connect

## Proposal
Using [Spotify's API](https://developer.spotify.com/web-api/endpoint-reference/),
Genre Connect will either visually display a connection between two
artists or allow a user to visually explore obscure genre's ( both via
the 'related artists' endpoint).

### First Possibility
For the first possibility, the user will begin at a splash page, which
will prompt the user for two inputs--the two artists that should be
connected. The forms will autocomplete to ensure that the user picks two
valid artists.

Upon submission, the app will initiate a breadth-first search of the
first artists's related artists until the second artist is reached.
Because of the nature of related artists, a depth-first search is not
possible. The search will be rendered in real-time, allowing the user
to see how the tree is traversed.

Once the second artist is found, the app will emphatically highlight the
path connecting the two artists. The user will be able to click on the
node for each artist to see more information (including getting clips of
their songs). Additionally, the app will optionally create a playlist
based on the path traversed.

Because the 'related artists' API endpoint also returns an array of the
artist's genres, it'll be possible to add additional interactions, such
as highlighting paths based on genres.

Because of Spotify's massive library, I expect that finding a connection
may impossible. This option only seems viable if I can come up with a
non-exponential way to complete the search.

### Second Possibility
The second possibility would visually look similar to the first
possibility. The user would begin by inputting an artist. The site would
make a GET request to the 'related artists' API, each of whose object
includes an array of genres. The child nodes would each contain one of
the related artists' genres. The user could then click on the desired
genre in order to populate only the related artists who fall under that
category.

The potential pitfall is that by the very nature of related artists,
there will be a lot of repeated genres. For that reason, I would have to
ensure that explored genres are not re-explored.

As with the previous example, I would like to provide the possibility of
creating a playlist based on the path that the user explored.

## MVPs
* The input fields in the splash page autocomplete
* A search tree is created in real-time
* After the search tree is created, the user can click the node to hear
  the artist's top track
* After the search tree is created, the user can highlight different
  paths based on shared genres.
* After the search tree is created, the user can choose to have a
  playlist created based on the traversed path's top songs.

## Wireframes
### Splash Page
![Splash Page](https://github.com/omarnyte/Artist-Connect/blob/master/Wireframes/splash_page.png)

### Connection Page
![Connection Page](https://github.com/omarnyte/Artist-Connect/blob/master/Wireframes/connection_page.png)

## Implementation Timeline
Weekend:
- [ ] Apply for Client ID / Client Secret

Day 1:
- [ ] Establish backend API logic.

Day 2:
- [ ] Create a skeleton of the node logic in D3

Day 3:
- [ ] Ensure that the appropriate API requests are made upon clicking on
a node

Day 4:
- [ ] Extract the relevant data from the JSON response, and integrate it
into the visual display

Day 5:
- [ ] Polish styling
- [ ] Integrate additional, non-JavaScript API features (e.g. creating a
playlist based on the path)
