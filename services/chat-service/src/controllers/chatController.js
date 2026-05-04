const {
  createConversation, addMember, saveMessage,
  getMessages, getUserConversations, getConversationById
} = require('../models/chatModel')

async function createConv(req, res) {
  try {
    const { tripId, type, name, memberIds } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })
    const conv = await createConversation({ tripId, type, name })
    await addMember(conv.id, req.user.id)
    if (memberIds && Array.isArray(memberIds)) {
      for (const memberId of memberIds) {
        await addMember(conv.id, memberId)
      }
    }
    return res.status(201).json({ message: 'Conversation created', conversation: conv })
  } catch (err) {
    console.error('Create conv error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getConversations(req, res) {
  try {
    const conversations = await getUserConversations(req.user.id)
    return res.status(200).json({ conversations })
  } catch (err) {
    console.error('Get conversations error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getConvMessages(req, res) {
  try {
    const { id } = req.params
    const messages = await getMessages(id)
    return res.status(200).json({ messages })
  } catch (err) {
    console.error('Get messages error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function sendMessage(req, res) {
  try {
    const { id } = req.params
    const { text, type } = req.body
    if (!text) return res.status(400).json({ error: 'text is required' })
    const message = await saveMessage({
      conversationId: id,
      senderId: req.user.id,
      senderName: req.user.email,
      text,
      type,
    })
    return res.status(201).json({ message })
  } catch (err) {
    console.error('Send message error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createConv, getConversations, getConvMessages, sendMessage }
