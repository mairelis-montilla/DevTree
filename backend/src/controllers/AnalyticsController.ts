import { Request, Response } from 'express';
import { UAParser } from 'ua-parser-js'; 
import Analytics from '../models/Analytics';
import User from '../models/User'; 
import { Types } from 'mongoose';

export class AnalyticsController {

    static trackEvent = async (req: Request, res: Response) => {
        try {
            const { type, handle, link } = req.body;

            const user = await User.findOne({ handle });
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            if (type === 'visit') {
                user.visits += 1;
                await user.save();
            }

            const ua = new UAParser(req.headers['user-agent']);
            const deviceType = ua.getDevice().type || 'desktop';
            const browserName = ua.getBrowser().name || 'unknown';

            const event = new Analytics({
                user: user._id,
                type,
                link: link || '',
                device: deviceType,
                browser: browserName
            });

            await event.save();

            res.status(201).json({ msg: 'Evento registrado correctamente' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error en el servidor al registrar evento' });
        }
    }

    static getStats = async (req: Request, res: Response) => {
        try {
            const userId = req.user._id.toString();

            const stats = await Analytics.aggregate([
                {
                    $match: { user: new Types.ObjectId(userId) }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        visits: {
                            $sum: { $cond: [{ $eq: ["$type", "visit"] }, 1, 0] }
                        },
                        clicks: {
                            $sum: { $cond: [{ $eq: ["$type", "click"] }, 1, 0] }
                        },
                        mobileVisits: {
                             $sum: { $cond: [{ $eq: ["$device", "mobile"] }, 1, 0] }
                        }
                    }
                },
                { $sort: { _id: 1 } },
                { $limit: 30 }
            ]);

            res.json(stats);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error al obtener las estadísticas' });
        }
    }
}