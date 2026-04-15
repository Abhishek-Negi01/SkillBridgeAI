import React, { useState } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const { report, getReportById, loading } = useInterview();
  const { interviewId } = useParams();

  const safeReport = {
    matchScore: report?.matchScore ?? 0,
    technicalQuestions: report?.technicalQuestions ?? [],
    behavioralQuestions: report?.behavioralQuestions ?? [],
    skillGaps: report?.skillGaps ?? [],
    preparationPlan: report?.preparationPlan ?? [],
    title: report?.title || "Interview Report",
  };

  const normalizeSeverity = (severity) => {
    const normalized = String(severity || "medium")
      .trim()
      .toLowerCase();
    return ["high", "medium", "low", "critical"].includes(normalized)
      ? normalized
      : "medium";
  };

  const renderIntention = (text, iconClass) => (
    <div className="intention-card">
      <div className="intention-icon">
        <i className={iconClass}></i>
      </div>
      <div className="intention-text">
        <span className="intention-label">Intention</span>
        <span>{text || "Explain why this question is being asked."}</span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "technical":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Technical Questions</h2>
              <p>
                Prepare for technical interviews with these targeted questions
              </p>
            </div>
            <div className="questions-list">
              {safeReport.technicalQuestions.map((item, index) => (
                <div key={index} className="question-card">
                  <div className="question-header">
                    <div className="question-meta">
                      <h3>Question {index + 1}</h3>
                      <div className="badges">
                        <span className="category-badge">Technical</span>
                      </div>
                    </div>
                    {renderIntention(item.intention, "fas fa-bullseye")}
                  </div>

                  <div className="question-content">
                    <div className="question-text">
                      <i className="fas fa-question-circle"></i>
                      <p>{item.question}</p>
                    </div>
                    <div className="answer-section">
                      <div className="answer-header">
                        <i className="fas fa-lightbulb"></i>
                        <h4>Sample Answer</h4>
                      </div>
                      <p className="answer">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "behavioral":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Behavioral Questions</h2>
              <p>Master leadership and culture fit with thoughtful scenarios</p>
            </div>
            <div className="questions-list">
              {safeReport.behavioralQuestions.map((item, index) => (
                <div key={index} className="question-card behavioral">
                  <div className="question-header">
                    <div className="question-meta">
                      <h3>Question {index + 1}</h3>
                      <div className="badges">
                        <span className="principle-badge">Leadership</span>
                      </div>
                    </div>
                    {renderIntention(item.intention, "fas fa-users")}
                  </div>

                  <div className="question-content">
                    <div className="question-text">
                      <i className="fas fa-comment-dots"></i>
                      <p>{item.question}</p>
                    </div>
                    <div className="answer-section">
                      <div className="answer-header">
                        <i className="fas fa-star"></i>
                        <h4>STAR Method Response</h4>
                      </div>
                      <p className="answer">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "roadmap":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>5-Day Preparation Roadmap</h2>
              <p>Structured learning path to maximize your interview success</p>
            </div>
            <div className="roadmap-timeline">
              {safeReport.preparationPlan.map((day, index) => {
                const priorityClass = normalizeSeverity(day.priority || "high");
                const progressPercent = day.progress ?? 40;
                const timeEstimate = day.duration || "6-8h";
                return (
                  <div key={index} className="day-card">
                    <div className="day-header">
                      <div className="day-info">
                        <div className="day-number">
                          <span className="day-circle">{day.day}</span>
                        </div>
                        <div className="day-content">
                          <h3>Day {day.day}</h3>
                          <span className="focus-area">{day.focus}</span>
                        </div>
                      </div>
                      <div className="day-meta">
                        <span className={`priority-badge ${priorityClass}`}>
                          {day.priority || "High Priority"}
                        </span>
                        <span className="time-estimate">
                          <i className="fas fa-clock"></i>
                          {timeEstimate}
                        </span>
                      </div>
                    </div>
                    <div className="tasks-container">
                      <h4>
                        <i className="fas fa-tasks"></i>
                        Daily Tasks
                      </h4>
                      <ul className="tasks-list">
                        {day.tasks.map((task, taskIndex) => (
                          <li key={taskIndex}>
                            <div className="task-checkbox">
                              <i className="fas fa-check"></i>
                            </div>
                            <span className="task-text">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Interview Analysis</h2>
              <p>Overview of your interview preparation status</p>
            </div>
            <div className="overview-stats">
              <div className="stat-card">
                <h3>Match Score</h3>
                <div className="stat-value">{safeReport.matchScore}%</div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <h1>Loading</h1>
      </main>
    );
  }

  return (
    <main className="interview">
      <div className="interview-container">
        <aside className="left-sidebar">
          <div className="sidebar-header">
            <h2>
              <i className="fas fa-clipboard-list"></i>
              Questions
            </h2>
          </div>
          <nav className="nav-menu">
            <button
              className={`nav-item ${activeSection === "technical" ? "active" : ""}`}
              onClick={() => setActiveSection("technical")}
            >
              <i className="fas fa-code"></i>
              <div className="nav-content">
                <span className="nav-title">Technical</span>
                <span className="nav-count">
                  {safeReport.technicalQuestions.length} Questions
                </span>
              </div>
            </button>
            <button
              className={`nav-item ${activeSection === "behavioral" ? "active" : ""}`}
              onClick={() => setActiveSection("behavioral")}
            >
              <i className="fas fa-users"></i>
              <div className="nav-content">
                <span className="nav-title">Behavioral</span>
                <span className="nav-count">
                  {safeReport.behavioralQuestions.length} Questions
                </span>
              </div>
            </button>
            <button
              className={`nav-item ${activeSection === "roadmap" ? "active" : ""}`}
              onClick={() => setActiveSection("roadmap")}
            >
              <i className="fas fa-map"></i>
              <div className="nav-content">
                <span className="nav-title">Roadmap</span>
                <span className="nav-count">
                  {safeReport.preparationPlan.length} Days
                </span>
              </div>
            </button>
          </nav>
        </aside>

        <div className="main-content">{renderContent()}</div>

        <aside className="right-sidebar">
          <div className="sidebar-header">
            <h2>
              <i className="fas fa-chart-bar"></i>
              Analysis
            </h2>
          </div>

          <div className="stats-section">
            <div className="match-score-card">
              <h3>
                <i className="fas fa-bullseye"></i>
                Match Score
              </h3>
              <div className="score-circle">
                <div className="score-inner">
                  <span className="score">{safeReport.matchScore}</span>
                  <span className="percent">%</span>
                </div>
              </div>
              <p className="score-description">
                {safeReport.matchScore >= 80
                  ? "Excellent Match!"
                  : safeReport.matchScore >= 60
                    ? "Good Match"
                    : "Needs Improvement"}
              </p>
            </div>

            <div className="skill-gaps-card">
              <h3>
                <i className="fas fa-exclamation-triangle"></i>
                Skill Gaps
              </h3>
              <div className="gaps-list">
                {safeReport.skillGaps.map((gap, index) => {
                  const severity = normalizeSeverity(gap.severity);
                  return (
                    <div key={index} className={`gap-item ${severity}`}>
                      <div className="gap-info">
                        <span className="skill-name">{gap.skill}</span>
                        <span className="priority-number">#{index + 1}</span>
                      </div>
                      <span className={`severity-badge ${severity}`}>
                        {gap.severity || "Medium"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="progress-card">
              <h3>
                <i className="fas fa-trophy"></i>
                Progress Stats
              </h3>
              <div className="progress-stats">
                <div className="stat-item">
                  <div className="stat-info">
                    <i className="fas fa-code"></i>
                    <span className="stat-label">Technical</span>
                  </div>
                  <span className="stat-value">
                    {safeReport.technicalQuestions.length}
                  </span>
                </div>
                <div className="stat-item">
                  <div className="stat-info">
                    <i className="fas fa-users"></i>
                    <span className="stat-label">Behavioral</span>
                  </div>
                  <span className="stat-value">
                    {safeReport.behavioralQuestions.length}
                  </span>
                </div>
                <div className="stat-item">
                  <div className="stat-info">
                    <i className="fas fa-calendar-alt"></i>
                    <span className="stat-label">Study Days</span>
                  </div>
                  <span className="stat-value">
                    {safeReport.preparationPlan.length}
                  </span>
                </div>
                <div className="stat-item">
                  <div className="stat-info">
                    <i className="fas fa-tasks"></i>
                    <span className="stat-label">Total Tasks</span>
                  </div>
                  <span className="stat-value">
                    {safeReport.preparationPlan.reduce(
                      (total, day) => total + (day.tasks?.length || 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Interview;
