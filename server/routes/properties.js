const express = require('express');
const { body } = require('express-validator');
const { Property } = require('../database/models');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/security');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all properties for current user
router.get('/', async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { user_id: req.user.id },
      order: [['date_added', 'DESC']]
    });

    res.json({ properties });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to get properties' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to get property' });
  }
});

// Create new property
router.post('/',
  [
    body('address').notEmpty().trim().withMessage('Address is required'),
    body('suburb').notEmpty().trim().withMessage('Suburb is required'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('propertyType').optional().isIn(['house', 'unit', 'townhouse', 'apartment']).withMessage('Invalid property type'),
    body('bedrooms').optional().isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
    body('bathrooms').optional().isFloat({ min: 0 }).withMessage('Bathrooms must be a non-negative number'),
    body('landSize').optional().isFloat({ min: 0 }).withMessage('Land size must be a positive number'),
    body('streetQuality').optional().isInt({ min: 1, max: 5 }).withMessage('Street quality must be between 1 and 5')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const propertyData = {
        user_id: req.user.id,
        address: req.body.address,
        suburb: req.body.suburb,
        postcode: req.body.postcode,
        price: req.body.price,
        property_type: req.body.propertyType,
        land_size: req.body.landSize,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        street_quality: req.body.streetQuality || 3,
        renovation_cost: req.body.renovationCost || 0,
        hampz_score: req.body.hampzScore,
        gahee_score: req.body.gaheeScore,
        b_score: req.body.bScore,
        is_favorite: req.body.isFavorite || false,
        tags: req.body.tags,
        notes: req.body.notes
      };

      const property = await Property.create(propertyData);

      res.status(201).json({ 
        message: 'Property saved successfully',
        property 
      });
    } catch (error) {
      console.error('Create property error:', error);
      res.status(500).json({ error: 'Failed to save property' });
    }
  }
);

// Update property
router.put('/:id',
  [
    body('price').optional().isFloat({ min: 0 }),
    body('streetQuality').optional().isInt({ min: 1, max: 5 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const property = await Property.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id
        }
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Update allowed fields
      const updateData = {};
      const allowedFields = [
        'address', 'suburb', 'postcode', 'price', 'property_type',
        'land_size', 'bedrooms', 'bathrooms', 'street_quality',
        'renovation_cost', 'hampz_score', 'gahee_score', 'b_score',
        'is_favorite', 'tags', 'notes'
      ];

      allowedFields.forEach(field => {
        const camelField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        if (req.body[camelField] !== undefined) {
          updateData[field] = req.body[camelField];
        }
      });

      await property.update(updateData);

      res.json({ 
        message: 'Property updated successfully',
        property 
      });
    } catch (error) {
      console.error('Update property error:', error);
      res.status(500).json({ error: 'Failed to update property' });
    }
  }
);

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await property.destroy();

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

module.exports = router;

