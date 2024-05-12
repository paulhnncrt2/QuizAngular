// question.component.ts
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';
import { ScoreService } from '../service/score.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  public name: string = "";
  public questionList: any[] = [];
  public shuffledQuestionList: any[] = [];
  public currentQuestion: number = 0;
  public point: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  worngAnswer: number = 0;
  intrval$: any;
  progress: any;
  isQuizCompleted: boolean = false;
  scores: any[] = [];

  constructor(private questionService: QuestionService, private scoreService: ScoreService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name") || 'Guest';
    this.loadQuestions();
    this.startCounter();
    this.loadScores(); // Ensure scores are loaded on init
  }

  loadQuestions() {
    this.questionService.getquestionjson().subscribe((res: any) => {
      this.questionList = res.questions;
      this.shuffleQuestions();
    });
  }

  shuffleQuestions() {
    const shuffledIndexes: number[] = [];
    while (shuffledIndexes.length < 4) {
      const randomIndex = Math.floor(Math.random() * this.questionList.length);
      if (!shuffledIndexes.includes(randomIndex)) {
        shuffledIndexes.push(randomIndex);
      }
    }
    this.shuffledQuestionList = shuffledIndexes.map(index => this.questionList[index]);
    this.currentQuestion = 0;
  }

  NextQuestion() {
    this.currentQuestion++;
    if (this.currentQuestion === this.shuffledQuestionList.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
      this.saveScore();
    }
  }

  PreviousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  answer(option: any) {
    if (option.correct) {
      this.point += 10;
      this.correctAnswer++;
    } else {
      this.point -= 10;
      this.worngAnswer++;
    }
    setTimeout(() => {
      this.NextQuestion();
      this.getProgressPercent();
      this.resetCounter();
    }, 1000);
  }

  startCounter() {
    this.intrval$ = interval(1000).subscribe(() => {
      this.counter--;
      if (this.counter === 0) {
        this.NextQuestion();
        this.counter = 60;
        this.point -= 10;
      }
    });
    setTimeout(() => {
      this.intrval$.unsubscribe();
    }, 600000);
  }

  stopCounter() {
    if (this.intrval$) {
      this.intrval$.unsubscribe();
    }
    this.counter = 0;
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz() {
    this.resetCounter();
    this.shuffleQuestions();
    this.point = 0;
    this.correctAnswer = 0;
    this.worngAnswer = 0;
    this.isQuizCompleted = false;
  }

  getProgressPercent() {
    this.progress = ((this.currentQuestion / this.shuffledQuestionList.length) * 100).toString();
    return this.progress;
  }

  saveScore() {
    const scoreData = { name: this.name, score: this.point };
    console.log('Saving score data:', scoreData);
    this.scoreService.saveScore(scoreData).subscribe(response => {
      console.log('Score saved successfully!', response);
      this.loadScores();
    }, error => {
      console.error('Error saving score:', error);
    });
  }

  loadScores() {
    this.scoreService.getScores().subscribe(scores => {
      console.log('Scores loaded:', scores);
      this.scores = scores;
    }, error => {
      console.error('Error loading scores:', error);
    });
  }
}
