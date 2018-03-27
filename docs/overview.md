# Overview
Notes, flow, and pseudo-code for Trivia Champ app.

## Events
**when the page loads**
```
display title view (html) and play button
initialize objects
```

**when the user clicks play button or play again:**
```
reset scores
request questions from otdb api
```

**when the questions from otdb api are received:**
```
hide title view and play button
render the quiz and done button
```

**when time runs out or user clicks done:**
```
count correct, incorrect, and unanswered questions
show scores
show play again button
```  
