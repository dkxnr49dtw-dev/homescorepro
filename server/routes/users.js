const express = require('express');
const bcrypt = require('bcrypt');
const { body } = require('express-validator');
const { User, UserPreferences } = require('../database/models');
const { authenticateToken } = require('../middleware/auth');
const { passwordValidation, handleValidationErrors } = require('../middleware/security');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash', 'email_verification_token', 'password_reset_token'] },
      include: [{
        model: UserPreferences,
        as: 'preferences'
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile',
  [
    body('firstName').optional().trim().escape(),
    body('lastName').optional().trim().escape(),
    body('email').optional().isEmail().normalizeEmail()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updateData = {};
      if (req.body.firstName !== undefined) updateData.first_name = req.body.firstName;
      if (req.body.lastName !== undefined) updateData.last_name = req.body.lastName;
      if (req.body.email !== undefined) {
        // Check if email is already taken
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({ error: 'Email already in use' });
        }
        updateData.email = req.body.email;
        updateData.email_verified = false; // Require re-verification if email changes
      }

      await user.update(updateData);

      res.json({ 
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// Change password
router.put('/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    passwordValidation
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { currentPassword, password } = req.body;

      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

      await user.update({ password_hash: passwordHash });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

// Get user preferences
router.get('/preferences', async (req, res) => {
  try {
    let preferences = await UserPreferences.findOne({
      where: { user_id: req.user.id }
    });

    if (!preferences) {
      // Create default preferences
      preferences = await UserPreferences.create({
        user_id: req.user.id,
        primary_goal: 'Balanced',
        budget_min: 500000,
        budget_max: 750000,
        family_status: 'Family',
        safety_priority: 8,
        geographic_categories: 'all',
        consensus_scoring: false,
        onboarding_complete: false
      });
    }

    res.json({ preferences });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

// Update user preferences
router.put('/preferences',
  [
    body('primaryGoal').optional().isIn(['Investment', 'Balanced', 'Lifestyle']),
    body('budgetMin').optional().isFloat({ min: 0 }),
    body('budgetMax').optional().isFloat({ min: 0 }),
    body('safetyPriority').optional().isInt({ min: 1, max: 10 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      let preferences = await UserPreferences.findOne({
        where: { user_id: req.user.id }
      });

      const updateData = {};
      if (req.body.primaryGoal !== undefined) updateData.primary_goal = req.body.primaryGoal;
      if (req.body.budgetMin !== undefined) updateData.budget_min = req.body.budgetMin;
      if (req.body.budgetMax !== undefined) updateData.budget_max = req.body.budgetMax;
      if (req.body.familyStatus !== undefined) updateData.family_status = req.body.familyStatus;
      if (req.body.safetyPriority !== undefined) updateData.safety_priority = req.body.safetyPriority;
      if (req.body.geographicCategories !== undefined) {
        updateData.geographic_categories = Array.isArray(req.body.geographicCategories) 
          ? JSON.stringify(req.body.geographicCategories) 
          : req.body.geographicCategories;
      }
      if (req.body.consensusScoring !== undefined) updateData.consensus_scoring = req.body.consensusScoring;
      if (req.body.onboardingComplete !== undefined) updateData.onboarding_complete = req.body.onboardingComplete;

      if (preferences) {
        await preferences.update(updateData);
      } else {
        updateData.user_id = req.user.id;
        preferences = await UserPreferences.create(updateData);
      }

      res.json({ 
        message: 'Preferences updated successfully',
        preferences 
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  }
);

module.exports = router;

