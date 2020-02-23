import { Op } from 'sequelize';
import Order from '../models/Order';

class DeliveryController {
  async index(req, res) {
    const { deliveried } = req.query;

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date:
          deliveried === 'true'
            ? {
                [Op.not]: null,
              }
            : null,
      },
    });

    return res.json(orders);
  }
}

export default new DeliveryController();
