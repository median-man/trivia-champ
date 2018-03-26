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