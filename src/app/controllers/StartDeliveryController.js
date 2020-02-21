import { isWithinInterval, startOfDay, endOfDay, setHours } from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';

class StartDeliveryController {
  async update(req, res) {
    const { deliveryman_id, order_id } = req.params;

    const date_now = new Date();
    const startDay = startOfDay(date_now);
    const endDay = endOfDay(date_now);
    const startWork = setHours(startDay, 8);
    const endWork = setHours(startDay, 18);

    const order = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id,
      },
    });

    if (!order) {
      return res
        .status(404)
        .json({ error: 'This order does not belong to that delivery man' });
    }

    if (order.end_date !== null) {
      return res.status(400).json({ error: 'Order already delivered' });
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order cancelled' });
    }

    if (order.start_date !== null) {
      return res.status(400).json({ error: 'Order already started' });
    }

    const ordersCount = await Order.count({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startDay, endDay],
        },
      },
    });

    if (ordersCount >= 5) {
      return res.status(400).json({ error: 'Sorry, only 5 orders per day' });
    }

    const isWithinTime = isWithinInterval(date_now, {
      start: startWork,
      end: endWork,
    });

    if (!isWithinTime) {
      return res.status(400).json({
        error: 'Os produtos só podem ser retirados entre as 08:00 e 18:00h.',
      });
    }

    await order.update({
      start_date: date_now,
    });

    return res.json(order);
  }
}

export default new StartDeliveryController();
