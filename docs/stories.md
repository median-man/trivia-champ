# User Stories
Trivia Champ user stories and acceptance criteria.

## Landing Page
### As a visitor, I want the landing page to tell me about the quiz.
**Scenario:** Visitor has navigated to the root of the web site and the landing page has loaded.
* "Trivia Champ" title is prominently displayed.
* A short description of the quiz is displayed.
* The descriptions states the amount of time the user will have to complete the quiz.

### As a user I want the landing page to have a play button which begins the quiz.
**Scenario:** User has decided to play the quiz.
* Landing page has a play button.
* Clicking play button starts the quiz. 

## Quiz
### As a user, I want the quiz to display 10 questions so that the quiz doesn't take too long to read.
**Scenario:** User has clicked play quiz.
* 10 Questions are displayed on the page.

### As a user, I want the remaining time to be displayed.
**Scenario:** Questions are displayed and the user is taking the quiz.
* The seconds remaining is always visible to the user.
* The seconds remaining is updated every time the value changes.
* The seconds remaining cannot be less than 0.

### As a user, I want the the time displayed to turn red when 5 or fewer seconds remain so that I know the quiz is about to end.
**Scenario:** User is taking the quiz and seconds remaining is 5 or less.
* The background color of the time remaining display is red.

### As a user, I want the time displayed to turn yellow when 10 or fewer seconds remain so that I know time is running out.
**Scenario:** User is taking the quiz and seconds remaining is > 5 and <= 10.
* The background color of the time remaining display is yellow.

### As a user, I want the quiz to end when time is up so that the quiz is challenging.
**Scenario:** User is taking the quiz and the seconds remaining is 0.
* The user is unable to answer any more questions.
* The user is unable to change any answers.
* The quiz results are displayed.

### As a user, I want the quiz to end when I click on the 'done' button so that I don't have to wait for the time to run out when I'm done answering questions.
**Scenario:** The user is taking the quiz AND seconds remaining is > 0 AND the user clicks the 'done' button.
* The user is unable to answer any more questions.
* The user is unable to change any answers.
* The quiz results are displayed.
* The seconds remaining stops ticking down. 

### As a user, I want to see my score when the quiz has ended.
**Scenario:** The quiz has ended due to time running out or the user clicking on done.
* The count of correctly answered questions is displayed.
* The count of incorrectly answered questions is displayed.
* The count of unanswered questions is displayed.

### As a user, I want the option to play again when the quiz has ended.
**Scenario:** The quiz has ended.
* 'Play again' button is displayed'

### As a user, I want the quiz to begin when I press the 'play again' button.
**Scenario:** The user has clicked the 'play again' button after reviewing the quiz results.
* The score and play again button are not visible.
* 10 questions are displayed.

### As a user, I want a different set of questions when I click play again.
**Scenario:** The user has clicked the 'play again' button after reviewing the quiz results.
* The score and play again button are not visible.
* 10 different questions are displayed.

**Scenario:** The user has clicked the 'play again' button and more questions aren't available.
* The score and play again button are not visible.
* The any 10 questions are displayed.


## Question
### As a user, I want to see which option I've selected as my answer to the question.
**Scenario:**

### As a user, I want the choices displayed in a randomized order so that I can't predict the position of the correct answer.
**Scenario:**
