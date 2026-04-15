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
        {/* Header */}
        <div className="page-header">
          <h1>SkillBridge AI</h1>
          <p>AI-Powered Interview Preparation Platform</p>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="job-panel glass-card">
            <div className="section-header">
              <h2>Job Description</h2>
              <span className="highlight">required</span>
              <p>Paste the job requirements and responsibilities</p>
            </div>
            <textarea
              onChange={(e) => setJobDescription(e.target.value)}
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste or type the complete job description here..."
              value={jobDescription}
            ></textarea>
          </div>

          <div className="action-panel">
            <div className="upload-card glass-card">
              <input
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
                <i className="fas fa-cloud-upload-alt"></i>
                <div>
                  <strong>Upload Resume</strong>
                  <span>Click to Browse (PDF)</span>
                </div>
              </label>
              {resumeName && (
                <p className="upload-note">Selected file: {resumeName}</p>
              )}
            </div>

            <div className="self-card glass-card">
              <div className="section-header">
                <h3>Self Description</h3>
              </div>
              <textarea
                onChange={(e) => setSelfDescription(e.target.value)}
                name="selfDescription"
                id="selfDescription"
                placeholder="Describe your professional background, skills, and experience..."
                value={selfDescription}
              ></textarea>
            </div>

            <button
              className="button primary-button"
              onClick={handleGenerateReport}
              disabled={
                !jobDescription.trim() || !resumeInputRef.current.files[0]
              }
            >
              <i className="fas fa-magic"></i>
              Generate Interview Report
            </button>
          </div>

          <div className="reports-section glass-card">
            <div className="reports-header">
              <h2>
                <i className="fas fa-history"></i>
                Recent Reports
              </h2>
              {reports && reports.length > 0 && (
                <span className="count-badge">{reports.length}</span>
              )}
            </div>

            {reports && reports.length > 0 ? (
              <div className="reports-list">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="report-item"
                    onClick={() => handleViewReport(report._id)}
                  >
                    <div className="report-content">
                      <h4>{report.title || "Interview Report"}</h4>
                      <div className="report-meta">
                        <span className="report-date">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        <span className="match-score">
                          {report.matchScore}%
                        </span>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-reports">
                <div className="empty-icon">
                  <i className="fas fa-clipboard-list"></i>
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
