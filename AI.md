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
***
#### while implementing change password:
**model:** chatgpt \
**prompt:** does mongoose schema models reflect mongo id by default?

**response summary:** said it's correct that model is reflecting ObjectId via _id field. \
**opinion and updates:** answer wasn't a valid one cause _id property is reflected via the hydrated document, not the model.
***
#### while adding readme:
**model:** claude \
**prompt:** i've finished an app using nest with mongo using mongoose using jwt and passport for the auth implementing singup, login and change password endpoints, write me a detailed readme on how to work with the repo, like the installation and prerequiests, the run process and the usage and so on.

**response summary:** detailed readme. \
**opinion and updates:** a very good one, just needed some updates on hashing algorithm used, endpoints details.
***
#### while configuring docker:
**model:** claude \
**prompt:** write me a multi staged docker file for the app alongside with docker compose and docker ignore for deployment.

**response summary:** detailed docker file, docker compose and docker ignore. \
**opinion and updates:** a very good one, just needed some updates on hashing algorithm used, endpoints details.
