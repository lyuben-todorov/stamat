# Stamat
A chess server implementation based on express servers and redis. For a description of the project structure, see [Architecture](https://github.com/lyuben-todorov/ebre-debre/blob/master/Architecture.md).    

Lesson 1 is that javascript code started losing it's maintainability right around 2.5k lines mostly due to having no type definitions and no idea what any object does or has or where it should be. This led to a loop of a lot of time debugging, writing bad code, then fixing that bad code with more bad code, etc. This would also mean writing any sort of documentation would be really annoying. Socket/redis communication could've been better thought out. 

Lesson 2 is that redis is really really good.

## Screenshots:
![](https://i.imgur.com/Oh9UVo5.png)
![](https://i.imgur.com/AJehSX3.png)
![](https://i.imgur.com/IOF1i0k.png)
## TODO
1. ~Concede - protocol~2
2. ~Concede - ui~
3. ~Game timer - protocol~
4. ~Game timer - ui~
5. ~Matchmaker frontend~
6. AI Mode
7. Sounds
8. ~Stats screen~
9. ~Chat~
10. Migrate to chessground

------- milestone 1    

* ~End to all session problems~ ~?? none so far~ no actually sessions are pretty shit 
* ~Player box - frontend~
* ~Game Components~
* Client timeout
* Session integrity - session must not leave server or cookies
* Botnet
* Analysis
* Matchmaker rework
* more ui??
* play as guest 
