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
Client identity is determined by their sessionId. Sessions persist the following info:

* Current match status and match identity (match key)
* Client state unrelated to matches

For brevity and maintainability we want to split our client states (mainly our client session info and different **dynamic** match states) into different stores (not everything in one place as for example redux is documented). 

Session is tightly knit to client state. The client session is only retrieved by http request (`/restore`). Given a valid auth token and a sessionId, the server tries to restore a session, if one exists, or creates a new one. User settings are a separate object from state. Match-related transactions happen by socket.

State is persisted to the session store on socket **disconnect** events.

Session storing and retrieval should be **complete**, leaving no session variables unpersisted. The client shouldn't have to perform extra actions to regain state even if the server restarts.

# Data types
### Universal Session Object
```
sessionId:string
username:string
email:string
inMatch:boolean
connected:boolean
matchIds:string[]
//session settings, matchmaker settings
```
### Session Settings 
```
autoAccept:boolean
```
### Server Session Info
```
connected:boolean
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

# Socket actions
```
/* Auth actions */
// this is the 404 message
AUTH_SESSION_UNKNOWN = "auth/SESSION_UNKNOWN";

AUTH_REQUEST_SESSION = "auth/REQUEST_SESSION";
AUTH_RESPOND_SESSION = "auth/RESPOND_SESSION";

/* Client-Server actions */
SERVER_START_MATCHMAKING = "server/START_MATCHMAKING";
SERVER_REPLY_MATCHUP = "server/REPLY_MATCHUP";
SERVER_REGISTER_USER = "server/REGISTER_USER"
SERVER_SEND_CHAT_MESSAGE = "server/SEND_CHAT_MESSAGE";

/* Game actions */
SERVER_PLAYER_READY = "server/PLAYER_READY";
SERVER_PLAYER_MOVE = "server/PLAYER_MOVE";
SERVER_OFFER_DRAW = "server/OFFER_DRAW";
SERVER_REPLY_DRAW = "server/REPLY_DRAW";
SERVER_CONCEDE = "server/CONCEDE_GAME";

/* Server-Client actions */
CLIENT_GAME_OVER = "client/GAME_OVER";
CLIENT_UPDATE_GAME = "client/UPDATE_GAME";
CLIENT_OFFER_DRAW = "client/OFFER_DRAW";
CLIENT_REPLY_DRAW = "client/REPLY_DRAW";

CLIENT_PROPOSE_MATCHUP = "client/PROPOSE_MATCHUP";
CLIENT_START_GAME = "client/START_GAME";
CLIENT_ALREADY_IN_QUEUE = "client/ALREADY_IN_QUEUE"
CLIENT_REGISTER_USER = "client/REGISTER_USER";
CLIENT_SEND_CHAT_MESSAGE = "client/SEND_CHAT_MESSAGE"

CLIENT_RESUME_GAME = "client/RESUME_GAME";


/* Client-Matchmaker actions */
MATCHMAKER_ADD_TO_QUEUE = "matchmaker/ADD_TO_QUEUE"

```