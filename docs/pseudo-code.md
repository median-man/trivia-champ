# Pseudo-code and Notes
Notes, flow, and pseudo-code for Trivia Champ app.

## Events
**when the page loads**
  ```
  display title view (html) and play button
  define app, timer, quiz, otdb API wrapper
  quiz.init()
  timer.init()
  app.init(timer, quiz)
  ```

**when the user clicks play button:**
  ```
  app.play();
  ```

**when time runs out:**
  ```
  app.endQuiz()
  ```

**when user clicks done:**
  ```
  app.endQuiz()
  ```

**when user clicks play again:**
  ```
  app.play()
  ```

## App Module
**init(timer, quiz):**  
  Initializes the application  
  Accepts a timer object and quiz object 
  ```
  ```
**questionServiceUnavailable():**
  ```
  display a message "Quiz currently unavailable. Try again later."
  ```
  
**play():**
  ```
  request questions from open trivia db
  then app.beginQuiz()
  ```

**beginQuiz():**
  ```
  if questions.length > 0
    quiz.setQuestions(questions)
    quiz.render()
    timer.start()
  else
    app.questionServiceUnavailable()
  ```

**endQuiz():**
  ```
  stop the timer
  hide the quiz
  calculate the score
  show the results
  ```
  
## Timer Module
**init(rootNodeSelector, seconds[, settings]):**
  ```
  set the rootNode
  if the rootNode isn't set, throw error "invalid rootNodeSelector: [rootNodeSelector]"
  initialTime = seconds
  if settings defined {
    set properties with settings
    optional settings include: onTimeOut
  }
  ```
**onTimeOut:**  
  ```
  Function to be called when time remaining is 0.
  ```

**start():**
  ```
  if onTimeOut is not a function {
    throw error "onTimeOut not set"
  }
  timeRemaining = initialTime
  timer.render()
  setInterval(timer.tick, interval)
  ```
  
**tick():**
  ```
  if time remaining > 0 {
    decrement timeRemaining
    timer.render()
  }
  else {
    timer.onTimeOut()
  }
  ```
  
**render():**
  ```
  display timeRemaining in rootNode
  show the timer
  ```

**hide():**
  ```
  hide the timer
  ```
## Quiz Module
**init():**
  ```
  ```