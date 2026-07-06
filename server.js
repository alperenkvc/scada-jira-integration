const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000

app.post('/api/scada-alarm', async (req, res) => {
    const {machineId, errorDetails, priority} = req.body;

    const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

    const jiraPayload = {
        fields: {
            project: {key: process.env.JIRA_PROJECT_KEY},
            summary: `Urgent: Fix ${machineId}`,
            description: `Alarm received from the SCADA system. \n\nDetails: ${errorDetails}`,
            issuetype: {name: "Story"},
        }
    }

    try{
        const response = await axios.post(
            `https://${process.env.JIRA_DOMAIN}/rest/api/2/issue`,
            jiraPayload,
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`Jira issue created: ${response.data.key}`);
        res.status(200).json({success: true, issueKey: response.data.key});
    }catch (error) {
        console.error('Error creating Jira issue:', error.response ? error.response.data : error.message);
        res.status(500).json({success: false, error: 'Cannot connect to Jira API'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});