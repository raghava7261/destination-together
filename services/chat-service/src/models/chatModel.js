const pool = require('../db')

async function createConversation({ tripId, type, name }) {
  const result = await pool.query(
    `INSERT INTO conversations (trip_id, type, name)
     VALUES ($1, $2, $3) RETURNING *`,
    [tripId, type || 'group', name]
  )
  return result.rows[0]
}

async function addMember(conversationId, userId) {
  const result = await pool.query(
    `INSERT INTO conversation_members (conversation_id, user_id)
     VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
    [conversationId, userId]
  )
  return result.rows[0]
}

async function saveMessage({ conversationId, senderId, senderName, text, type }) {
  const result = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, sender_name, text, type)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [conversationId, senderId, senderName, text, type || 'text']
  )
  return result.rows[0]
}

async function getMessages(conversationId, limit = 50) {
  const result = await pool.query(
    `SELECT * FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC
     LIMIT $2`,
    [conversationId, limit]
  )
  return result.rows
}

async function getUserConversations(userId) {
  const result = await pool.query(
    `SELECT c.*, 
      m.text as last_message,
      m.created_at as last_message_at,
      m.sender_name as last_sender
     FROM conversations c
     JOIN conversation_members cm ON c.id = cm.conversation_id
     LEFT JOIN messages m ON m.id = (
       SELECT id FROM messages
       WHERE conversation_id = c.id
       ORDER BY created_at DESC LIMIT 1
     )
     WHERE cm.user_id = $1
     ORDER BY COALESCE(m.created_at, c.created_at) DESC`,
    [userId]
  )
  return result.rows
}

async function getConversationById(id) {
  const result = await pool.query(
    'SELECT * FROM conversations WHERE id = $1',
    [id]
  )
  return result.rows[0]
}

module.exports = {
  createConversation, addMember, saveMessage,
  getMessages, getUserConversations, getConversationById
}
