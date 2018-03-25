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
**init(rootElementSelector, seconds[, settings]):**
  ```
  set the rootNode
  if the rootNode isn't set, throw error "invalid rootElementSelector: [rootElementSelector]"
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
  timeRemaining = initialTime
  timer.intervalId = setInterval(timer.tick, interval)
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
  ```

**hide():**
  ```
  hide the timer
  ```

## Question Class
**constructor(values)**
  ```
  assign all values to instance
  ```
  
**appendTo(container)**
  ```
  create html element
  set element property
  render html in container as the last child
  return this
  ```

**getResult()**
  ```
  get actual answer
  if no answer {
    return 'unanswered'
  }
  if actual answer = expected answer {
    return 'correct'
  }
  return 'incorrect'
  ```
  

## Quiz Module
**init(selector):**
  ```
  set rootElement property
  if rootElement not set {
    throw error 'selector not in document. selector: [selector]'    
  }
  return module
  ```

**setQuestions(questions):**
  ```
  for each item in questions
    create a new question object
    push new question to questions property
  return module
  ```
  
**render()**
  ```
  empty questions container
  for each question in this.questions {
    append question to questions container
  }
  ```
**show()**
  ```
  make rootElement visible
  ```

**hide()**
  ```
  hide the rootElement
  ```
**calculateScore()**
  ```
  for each question
    let result = question.getResult()
    if result = unanswered
      increment this.score.unanswered
    if result = correct
      increment this.score.correct
    if result = incorrect
      increment this.score.incorrect
  return this
  ```
