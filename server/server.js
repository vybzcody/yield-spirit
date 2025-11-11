// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const AutonomousYieldService = require('./autonomous-yield-service');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
let autonomousYieldService;

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/monitored-tokens', (req, res) => {
  if (autonomousYieldService) {
    res.json(autonomousYieldService.getMonitoredTokens());
  } else {
    res.json([]);
  }
});

app.get('/api/status', (req, res) => {
  res.json({ 
    autonomousServiceRunning: autonomousYieldService?.running || false,
    monitoredTokens: autonomousYieldService?.monitoredTokens?.size || 0
  });
});

// Initialize and start services
async function initializeServices() {
  try {
    autonomousYieldService = new AutonomousYieldService();
    await autonomousYieldService.initialize();
    await autonomousYieldService.start();
    
    console.log('All services initialized');
  } catch (error) {
    console.error('Error initializing services:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await initializeServices();
  
  app.listen(PORT, () => {
    console.log(`YieldSpirit server running on port ${PORT}`);
    console.log(`Autonomous yield service initialized and running`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  if (autonomousYieldService) {
    await autonomousYieldService.stop();
  }
  process.exit(0);
});

startServer().catch(console.error);

module.exports = app;