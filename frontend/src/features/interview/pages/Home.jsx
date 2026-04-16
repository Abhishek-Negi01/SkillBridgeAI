

import React, { useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeName, setResumeName] = useState("");

  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    navigate(`/interview/${data._id}`);
  };

  const handleViewReport = (reportId) => {
    navigate(`/interview/${reportId}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Generating Your Interview Report</h2>
          <p>Please wait while we analyze your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      <div className="home-container">
        <div className="page-header">
          <h1>SkillBridge AI</h1>
          <p>AI-Powered Interview Preparation Platform</p>
        </div>

        <div className="main-content">
          <div className="job-panel glass-card">
            <div className="section-header">
              <h2>Job Description</h2>
            </div>
            <textarea
              data-testid="job-description-textarea"
              onChange={(e) => setJobDescription(e.target.value)}
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste or type the complete job description here..."
              value={jobDescription}
            ></textarea>
          </div>

          <div className="action-panel">
            <div className="upload-card glass-card gradient-card">
              <input
                data-testid="resume-upload-input"
                ref={resumeInputRef}
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setResumeName(file ? file.name : "");
                }}
              />
              <label className="upload-dropzone" htmlFor="resume">
                <div className="upload-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path
                      d="M40 10C32.5 10 26.25 15.625 25.625 22.8125C18.75 24.0625 13.75 30 13.75 37.5C13.75 45.625 20.3125 52.5 28.75 52.5H38.75V35.625L33.125 41.25L28.75 36.875L40 25.625L51.25 36.875L46.875 41.25L41.25 35.625V52.5H51.25C58.4375 52.5 64.375 46.5625 64.375 39.375C64.375 32.8125 59.6875 27.1875 53.4375 26.25C52.1875 16.875 44.6875 10 40 10Z"
                      fill="currentColor"
                      fillOpacity="0.7"
                    />
                    <path
                      d="M28.75 55H51.25V70H28.75V55Z"
                      fill="currentColor"
                      fillOpacity="0.7"
                    />
                  </svg>
                </div>
                <div className="upload-text">
                  <strong>Upload Resume</strong>
                  <span>Drag & Drop or Click to Browse</span>
                  <span className="file-types">(PDF, DOCX)</span>
                </div>
              </label>
              {resumeName && (
                <p className="upload-note">
                  <i className="fas fa-file-alt"></i> {resumeName}
                </p>
              )}
            </div>

            <div className="self-card glass-card">
              <div className="section-header">
                <h3>Self Description</h3>
              </div>
              <textarea
                data-testid="self-description-textarea"
                onChange={(e) => setSelfDescription(e.target.value)}
                name="selfDescription"
                id="selfDescription"
                placeholder="Describe your professional background, skills, and experience..."
                value={selfDescription}
              ></textarea>
            </div>

            <button
              data-testid="generate-report-button"
              className="button primary-button"
              onClick={handleGenerateReport}
              disabled={
                !jobDescription.trim() || !resumeInputRef.current?.files[0]
              }
            >
              <span className="button-text">Generate Interview Report</span>
            </button>
          </div>

          <div className="reports-section glass-card">
            <div className="reports-header">
              <h2>Recent Reports</h2>
              {reports && reports.length > 0 && (
                <span className="count-badge">{reports.length}</span>
              )}
            </div>

            {reports && reports.length > 0 ? (
              <div className="reports-list">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    data-testid={`report-item-${report._id}`}
                    className="report-item"
                    onClick={() => handleViewReport(report._id)}
                  >
                    <div className="report-date-badge">
                      <span className="month">
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short" },
                        )}
                      </span>
                      <span className="day">
                        {new Date(report.createdAt).getDate()}
                      </span>
                    </div>
                    <div className="report-content">
                      <h4>{report.title || "Interview Report"}</h4>
                    </div>
                    <i className="chevron-right">›</i>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-reports">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path
                      d="M38 6H10C8.9 6 8 6.9 8 8V40C8 41.1 8.9 42 10 42H38C39.1 42 40 41.1 40 40V8C40 6.9 39.1 6 38 6ZM36 38H12V10H36V38ZM14 20H34V24H14V20ZM14 28H34V32H14V28ZM14 12H34V16H14V12Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3>No Reports Yet</h3>
                <p>Generate your first interview report to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
