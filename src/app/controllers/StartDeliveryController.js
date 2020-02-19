import { isBefore, subHours, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';

class StartDeliveryController {
  async update(req, res) {
    const { man_id: deliveryman_id, id } = req.params;

    const date_now = new Date();

    const verifyLimitDeliveries = await Order.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(date_now), endOfDay(date_now)],
        },
      },
    });

    if (verifyLimitDeliveries.length === 5) {
      return res.status(400).json({ error: 'Sorry, only 5 orders per day' });
    }

    return res.json({ verifyLimitDeliveries });
  }
}

export default new StartDeliveryController();
