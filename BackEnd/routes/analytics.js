const router = require('express').Router();
const ctrl = require('../controller/analytics.controller');

// Pronóstico y fraude
router.get('/pronostico', ctrl.pronosticoDemanda);
router.get('/fraudes', ctrl.deteccionFraudes);

module.exports = router;