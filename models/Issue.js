// models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issueID: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    resources: [{ type: String }],
    assignedTo: { type: String },  // For builder, tester, or gatherer
    status: { type: String, default: 'open' },  // For example: open, in-progress, completed
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
