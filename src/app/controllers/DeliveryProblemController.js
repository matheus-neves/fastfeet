import * as Yup from 'yup';
import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { order_id } = req.params;

    const orderExist = await Order.findByPk(order_id);

    if (!orderExist) {
      return res.status(404).json({ error: 'Order not exists' });
    }

    const problems = await DeliveryProblem.findAll({
      where: {
        id: order_id,
      },
      attributes: ['id', 'delivery_id', 'description'],
    });

    return res.json(problems);
  }

  async store(req, res) {
    const { order_id } = req.params;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const orderExist = await Order.findByPk(order_id);

    if (!orderExist) {
      return res.status(404).json({ error: 'Order not exists' });
    }

    const { id, delivery_id, description } = await DeliveryProblem.create({
      delivery_id: order_id,
      description: req.body.description,
    });

    return res.json({ id, delivery_id, description });
  }
}

export default new DeliveryProblemController();
