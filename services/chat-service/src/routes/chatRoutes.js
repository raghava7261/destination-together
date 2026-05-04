const express = require('express')
const { createConv, getConversations, getConvMessages, sendMessage } = require('../controllers/chatController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()
router.use(authMiddleware)

router.post('/', createConv)
router.get('/', getConversations)
router.get('/:id/messages', getConvMessages)
router.post('/:id/messages', sendMessage)

module.exports = router
