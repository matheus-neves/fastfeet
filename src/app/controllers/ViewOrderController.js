import { Op } from 'sequelize';
import Order from '../models/Order';

class ViewOrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
    });

    return res.json(orders);
  }

  async indexDelivered(req, res) {
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: {
          [Op.not]: null,
        },
      },
    });

    return res.json(orders);
  }
}

export default new ViewOrderController();
