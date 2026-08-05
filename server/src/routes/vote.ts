import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getStats, recordVote } from '../config/firebase';
import { voteLimiter, apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Zod validation schema for POST /api/vote
const voteSchema = z.object({
  choice: z.enum(['ate', 'not_yet']),
  deviceToken: z.string().min(5).max(100),
});

/**
 * GET /api/stats
 * Fetches current real-time statistics
 */
router.get('/stats', apiLimiter, async (_req: Request, res: Response) => {
  try {
    const stats = await getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching statistics.',
    });
  }
});

/**
 * POST /api/vote
 * Records a vote and returns updated real-time stats
 */
router.post('/vote', voteLimiter, async (req: Request, res: Response) => {
  try {
    // Check cookie anti-spam
    if (req.cookies && req.cookies['ancom_voted']) {
      res.status(400).json({
        success: false,
        error: 'You have already voted from this device.',
      });
      return;
    }

    // Validate request body
    const parseResult = voteSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input payload.',
        details: parseResult.error.issues,
      });
      return;
    }

    const { choice, deviceToken } = parseResult.data;

    // Record vote
    const updatedStats = await recordVote(choice, deviceToken);

    // Set anti-spam HTTP cookie for 30 days
    res.cookie('ancom_voted', choice, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: updatedStats,
    });
  } catch (error: any) {
    console.error('Error processing vote:', error);

    if (error?.message?.includes('SPAM_PREVENTED')) {
      res.status(400).json({
        success: false,
        error: 'You have already voted from this device.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error processing vote.',
    });
  }
});

export default router;
