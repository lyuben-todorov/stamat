# Project architecture
We want a design that fulfills these conditions:

1. The architecture is easily horizontally scalable. Meanning more capacity can be easiliy added through simply more server instances.
2. To make (1) much easier, Servers are redundant. Specific server instances may hold no unpersisted state or produce any server-specific side effects.
3. To make (2) much easier, we need a fast database for storing sessions with a self-replicating mechanism. 
4. To make (2) much easier, use a form of pub/sub implementation. We need a 3rd party (other than client & server) truth holder to communicate information to subscribed clients(proxied by the server).
5. With pub/sub implementations being generally fast, this allows us to scale multiple slow server instances for a single fast pub/sub instance.
6. Scaling the pub/sub instance should not be our concern. Even then I don't think there's one that doesn't offer a self-replicating mechanism out of the box.

Stack: 
* **Express (Server)**
* **Redis(Pub/Sub and session store)** - Perfect for (3) and then (4)
* **Mongo(Static store)** - We still need some place to store user credentials and data.

The rest of this refers to redis as the 'session store', that's for storing short term data and is regularly flushed.
MongoDB is reffered as the 'static store' used for long-term data.
# Authentication
Authentication is really basic with the caveat that on successful login, the server also issues a sessionId cookie use to identify user session.

The server checks the session store for an existing sessionId and if successful, retrieves it, if not, issues a new one and sets it as the current sessionId for the user IN session store(corresponding session should maybe be stored in the static store instead).

# Sessions
Servers use sessions. On the client, session is stored as a cookie. When a client connects to a server instance, it does so with a session query param:
```javascript
let socket = io(`http://localhost:3001?session=${someSessionId}`);
```
In turn, the server checks for an existing session object in the session store. 
If it's found, the server issues a `client/RESUME_SESSION` with the corresponding parameters. 


This is more important for the server, as it relies on "on connection" callback scoped variables.


State is persisted to the session store on socket "disconnect" events.


Session storing and retrieval should be **complete**, leaving no session variables unpersisted. The client shouldn't have to perform extra actions to regain state even if the server restarts.

# Client-Server & Server-Client communication
## server/
* START_MATCHMAKING
* REPLY_MATCHUP
* REGISTER_USER

## game/
* PLAYER_READY
* PLAYER_MOVE
* OFFER_DRAW
* CONCEDE

## client/
* GAME_OVER
* UPDATE_GAME
* OFFER_DRAW

* PROPOSE_MATCHUP
* START_GAME
* ALREADY_IN_QUEUE

* RESUME_GAME
* RESUME_SESSION

## matchmaker/
* ADD_TO_QUEUE
