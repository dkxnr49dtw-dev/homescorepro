const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { authenticateToken, requirePaidAccess } = require('../middleware/auth');
const { SearchHistory, FavoriteSuburb } = require('../database/models');

const router = express.Router();

// Load suburbs data (in production, this would come from database)
let suburbsData = null;

async function loadSuburbsData() {
  if (suburbsData) return suburbsData;
  
  try {
    const dataPath = path.join(__dirname, '../../data/suburbs.csv');
    const csvContent = await fs.readFile(dataPath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
    suburbsData = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const suburb = {};
        headers.forEach((header, index) => {
          suburb[header.trim()] = values[index]?.trim() || '';
        });
        return suburb;
      });
    
    return suburbsData;
  } catch (error) {
    console.error('Error loading suburbs data:', error);
    return [];
  }
}

// Get all suburbs (requires paid access for full data)
router.get('/', authenticateToken, requirePaidAccess, async (req, res) => {
  try {
    const suburbs = await loadSuburbsData();
    res.json({ suburbs, count: suburbs.length });
  } catch (error) {
    console.error('Get suburbs error:', error);
    res.status(500).json({ error: 'Failed to get suburbs' });
  }
});

// Search suburbs
router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const suburbs = await loadSuburbsData();
    const searchQuery = query.toLowerCase().trim();
    
    const results = suburbs
      .filter(suburb => {
        const name = (suburb.suburb || '').toLowerCase();
        const postcode = (suburb.postcode || '').toLowerCase();
        return name.includes(searchQuery) || postcode.includes(searchQuery);
      })
      .slice(0, parseInt(limit));

    // Log search history for paid users
    if (req.user.subscriptionStatus === 'active') {
      try {
        await SearchHistory.create({
          user_id: req.user.id,
          search_type: 'suburb',
          search_query: query,
          results_count: results.length
        });
      } catch (err) {
        console.error('Error logging search:', err);
      }
    }

    res.json({ 
      results,
      count: results.length,
      query 
    });
  } catch (error) {
    console.error('Search suburbs error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get single suburb by name
router.get('/:name', authenticateToken, requirePaidAccess, async (req, res) => {
  try {
    const suburbs = await loadSuburbsData();
    const suburb = suburbs.find(s => 
      s.suburb?.toLowerCase() === req.params.name.toLowerCase()
    );

    if (!suburb) {
      return res.status(404).json({ error: 'Suburb not found' });
    }

    res.json({ suburb });
  } catch (error) {
    console.error('Get suburb error:', error);
    res.status(500).json({ error: 'Failed to get suburb' });
  }
});

// Get favorite suburbs
router.get('/favorites/list', authenticateToken, async (req, res) => {
  try {
    const favorites = await FavoriteSuburb.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });

    res.json({ favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorite suburbs' });
  }
});

// Add favorite suburb
router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { suburbName, postcode } = req.body;

    if (!suburbName) {
      return res.status(400).json({ error: 'Suburb name is required' });
    }

    const [favorite, created] = await FavoriteSuburb.findOrCreate({
      where: {
        user_id: req.user.id,
        suburb_name: suburbName,
        postcode: postcode || null
      }
    });

    res.json({ 
      message: created ? 'Suburb added to favorites' : 'Suburb already in favorites',
      favorite 
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite suburb' });
  }
});

// Remove favorite suburb
router.delete('/favorites/:id', authenticateToken, async (req, res) => {
  try {
    const favorite = await FavoriteSuburb.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await favorite.destroy();

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;


