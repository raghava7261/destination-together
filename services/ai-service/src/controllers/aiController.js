async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error('Groq API error: ' + err)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

async function getPOIAlerts(req, res) {
  try {
    const { fromCity, toCity } = req.body
    if (!fromCity || !toCity) {
      return res.status(400).json({ error: 'fromCity and toCity are required' })
    }

    const prompt = `You are a travel assistant for a carpooling app called Destination Together.
A group of travelers is driving from ${fromCity} to ${toCity}.

Find 2-3 popular tourist attractions or interesting stops close to the direct route.

Respond in this exact JSON format only:
[
  {
    "name": "Place Name",
    "description": "One engaging sentence about why travelers should stop here",
    "detour": "X miles off route",
    "category": "Historic/Nature/Food/Entertainment"
  }
]

Respond with ONLY the JSON array, no other text.`

    const text = await callGroq(prompt)
    let pois = []
    try {
      const clean = text.replace(/\`\`\`json|\`\`\`/g, '').trim()
      pois = JSON.parse(clean)
    } catch (e) {
      pois = [{ name: 'Scenic Route Stop', description: 'A beautiful stop along your route.', detour: '5 miles off route', category: 'Nature' }]
    }

    return res.status(200).json({ pois, fromCity, toCity })
  } catch (err) {
    console.error('POI alerts error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

async function getRouteInfo(req, res) {
  try {
    const { fromCity, toCity } = req.body
    if (!fromCity || !toCity) {
      return res.status(400).json({ error: 'fromCity and toCity are required' })
    }

    const prompt = `Give a brief travel summary for a road trip from ${fromCity} to ${toCity}.

Respond in this exact JSON format only:
{
  "estimatedMiles": 850,
  "estimatedHours": 13,
  "bestTimeToTravel": "Early morning to avoid traffic",
  "roadTip": "One practical tip for this specific route",
  "weather": "Typical weather conditions"
}

Respond with ONLY the JSON, no other text.`

    const text = await callGroq(prompt)
    let info = {}
    try {
      const clean = text.replace(/\`\`\`json|\`\`\`/g, '').trim()
      info = JSON.parse(clean)
    } catch (e) {
      info = { estimatedMiles: 500, estimatedHours: 8, bestTimeToTravel: 'Early morning', roadTip: 'Check traffic before departure.', weather: 'Varies by season' }
    }

    return res.status(200).json({ ...info, fromCity, toCity })
  } catch (err) {
    console.error('Route info error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { getPOIAlerts, getRouteInfo }
