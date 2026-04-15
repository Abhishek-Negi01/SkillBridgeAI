const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service.js");
const interviewReportModel = require("../models/interviewReport.model.js");

/**
 * @name generateInterviewReportController
 * @description generate a interview report , expects resume, job description and self description(optional but needed for best results).
 * @access private
 */
async function generateInterviewReportController(req, res) {
  const resumeFile = req.file;

  const unit8Buffer = Uint8Array.from(resumeFile.buffer);

  const PDFParserClass = pdfParse.PDFParse;

  const parser = new PDFParserClass(unit8Buffer);

  const resumeContent = await parser.getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewResponseByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription: selfDescription,
    jobDescription: jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription: selfDescription,
    jobDescription: jobDescription,
    ...interviewResponseByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully.",
    interviewReport,
  });
}

/**
 * @name getInterviewReportByIdController
 * @description return interview report of a specific interviewID from database, expects interviewId from url params.
 * @access private
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  return res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @name getAllInterviewReportsController
 * @description return all interview reports generated till now for current logged in user.
 * @access private
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({
      user: req.user.id,
    })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  if (!interviewReports) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  return res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}
module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};
