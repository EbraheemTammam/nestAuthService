## AI usage throught the Implementation
this is a walk through AI usage throught the implmentation including agents, prompts, response summary, my opinion and if there's any updates needed on the response.

***
#### while implementing user create:
**model:** gemini \
**prompt:** in the context of password hashing I need a fully detailed comparison between bcrypt and argon2

**response summary:** bcrypt cpu usage vs argon2 being memory-hard and effective against custom graphic cards and dedicated hardware to crack passwords. \
**opinion:** a good and detailed response that gives a clear intuition about both of them and clarifying argon2 is the winner.
***
#### while implementing login:
**model:** gemini \
**prompt:** while handling timing attack what are the best strategies?

**response summary:** comparison about making fake hashing and the downside of consuming resources, making and explicit delay based on a computed process min or average execution time, using rate limiting. \
**opinion:** response clarifies that using explicit delay is better than fake hashing, alongside with throtteling as a must.
