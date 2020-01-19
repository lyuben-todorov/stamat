# Stamat
A chess server implementation based on express servers and redis. For a description of the project structure, see [Architecture](https://github.com/lyuben-todorov/ebre-debre/blob/master/Architecture.md).    

Lesson 1 is that javascript code started losing it's maintainability right around 2.5k lines mostly due to having no type definitions and no idea what any object does or has or where it should be. This led to a loop of a lot of time debugging, writing bad code, then fixing that bad code with more bad code, etc. This would also mean writing any sort of documentation would be really annoying. Socket/redis communication could've been better thought out. 

Lesson 2 is that redis is really really good.
# TODO
1. ~Concede - protocol~2
2. ~Concede - ui~
3. ~Game timer - protocol~
4. ~Game timer - ui~
5. ~Matchmaker frontend~
6. AI Mode
7. Sounds
8. ~Stats screen~
9. ~Chat~

------- milestone 1    

10. ~End to all session problems~ ~?? none so far~ no actually sessions are pretty shit 
11. ~Player box - frontend~
12. ~Game Components~
13. Client timeout
14. Session integrity - session must not leave server or cookies
15. Botnet
16. Analysis
17. Matchmaker rework
18. more ui??
19. play as guest 
