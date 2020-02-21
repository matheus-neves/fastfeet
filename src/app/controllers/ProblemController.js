import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class ProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      attributes: ['id', 'delivery_id', 'description'],
    });

    return res.json(problems);
  }

  async update(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblem.findByPk(id);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const { delivery_id } = problem;

    const order = await Order.findByPk(delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
        },
      ],
    });

    if (order.end_date !== null) {
      return res.status(400).json({ error: 'Order already delivered' });
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    await order.update({
      canceled_at: new Date(),
    });

    await Queue.add(CancellationMail.key, {
      order,
      problem,
    });

    return res.json(order);
  }
}

export default new ProblemController();
