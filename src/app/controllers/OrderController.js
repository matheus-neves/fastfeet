import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import OrderMail from '../jobs/OrderMail';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        canceled_at: null,
      },
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.create(req.body);

    const { recipient, deliveryman } = await Order.findByPk(order.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(OrderMail.key, {
      order: order.toJSON(),
      deliveryman: deliveryman.toJSON(),
      recipient: recipient.toJSON(),
    });

    return res.status(201).json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'That order was cancelled' });
    }

    const updatedOrder = await order.update(req.body);

    return res.json(updatedOrder);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res
        .status(400)
        .json({ error: 'Id not registered in the system.' });
    }

    order.canceled_at = new Date();

    await order.save();

    return res.json(order);
  }
}

export default new OrderController();
