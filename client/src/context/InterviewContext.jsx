import React, { createContext, useState, useCallback } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [currentInterview, setCurrentInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const startInterview = useCallback((interview) => {
    setCurrentInterview(interview);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeElapsed(0);
  }, []);

  const updateCurrentAnswer = useCallback((answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  }, [answers, currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, interviewQuestions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const skipQuestion = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const endInterview = useCallback(() => {
    setCurrentInterview(null);
    setCurrentQuestionIndex(0);
  }, []);

  const value = {
    currentInterview,
    isLoading,
    error,
    interviewQuestions,
    setInterviewQuestions,
    currentQuestionIndex,
    answers,
    timeElapsed,
    setTimeElapsed,
    startInterview,
    updateCurrentAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    endInterview,
  };

  return (
    <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = React.useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
};
