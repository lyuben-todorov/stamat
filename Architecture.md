# Project architecture  v2
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
Authentication is standard with the caveat that on successful login, the server also issues a **session restore**. A unique auth token is issued. Without an auth token a client cannot restore/request a sessionId.

# Sesssion Restore
An **authenticated** client calls for a session restore from a server. The server checks the session store for an existing session. If successful, it restores it to the client. If not, it issues a new one. Sessions expire after 24hrs.

# Sessions
Client identity is determined by their sessionId and auth token. Sessions persist the following info:

* Current match status and match identity (match key)
* Client state unrelated to matches

For brevity and maintainability we want to split our client states (mainly our client session info and different **dynamic** match states) into different stores (not everything in one place as for example redux is documented). Since session is tightly knit to a certain client state that's modifed via socket, client sockets should be initialized together with state. When a dynamic state store is initialized with a certain socket identity, it does so with a session query parameter:
```javascript
let socket = io(`http://server.com?session=${someSessionId}`);
```
In turn, the server checks for an existing dynamic session object in the session store. 
If it's found, the server issues a `client/RESUME_SESSION` with the corresponding parameters. 

Related state is persisted to the session store on socket **disconnect** events.

Session storing and retrieval should be **complete**, leaving no session variables unpersisted. The client shouldn't have to perform extra actions to regain state even if the server restarts.

# Socket actions
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

# Data types
### Client Session Object
```
sessionId : String
username: String
email: String
inMatch: Bool
matchId : String?
```
### Game Session Object
Computed per player from game object in store.
```
matchId: String
playerName: String
playerColor: String
playerTime: String // individual time remaining in milliseconds 10*60*1000

opponentName: String
opponentColor: String
opponentTime: String

onMove: Bool 
issueTime: // unix time of issue by matchmaker
gameTime: //  game time by spec  in seconds 
gameType: Enum // CHESS, CHESS_360?, FISCHER_CHESS?

finished: Bool
winner: String
chatHistory: MessageObject[]  // 
position: String // fen string
moveHistory: String //not verbose
```