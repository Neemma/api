const express = require('express');
const router = express.Router();
const africasTalkingHelper = require('../utils/africasTalkingHelper');
const fs = require('fs');

const BLOCK_REASONS_FILE = 'block_reasons.json';

router.post('/', async (req, res) => {
  const { reason, msisdn } = req.body;

  // Save to JSON file
  saveReasonToFile(msisdn, reason);

  try {
    await africasTalkingHelper.sendSMS(msisdn, 'Your transaction block request has been received.');
    res.status(200).json({ code: 4000, message: 'Request to block transactions received.' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Error processing request.' });
  }
});

function saveReasonToFile(msisdn, reason) {
  let blockReasons = loadBlockReasons(); 
  blockReasons[msisdn] = reason; 

  fs.writeFileSync(BLOCK_REASONS_FILE, JSON.stringify(blockReasons));
}

function loadBlockReasons() {
  try {
    const data = fs.readFileSync(BLOCK_REASONS_FILE);
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, it's likely the first request
    return {};
  }
}

module.exports = router;
