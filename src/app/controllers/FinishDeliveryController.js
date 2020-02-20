import { Op } from 'sequelize';
import * as Yup from 'yup';
import Order from '../models/Order';
import File from '../models/File';

class FinishDeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, order_id } = req.params;
    const { signature_id } = req.body;
    const date_now = new Date();

    const order = await Order.findOne({
      where: {
        id: order_id,
        end_date: null,
        canceled_at: null,
        deliveryman_id: {
          [Op.eq]: deliveryman_id,
        },
        start_date: {
          [Op.not]: null,
        },
      },
    });

    if (!order) {
      return res.status(400).json({ error: 'Invalid order' });
    }

    const checkIdExist = await File.findByPk(signature_id);

    if (!checkIdExist) {
      return res.status(404).json({ error: 'Signature not found' });
    }

    await order.update({
      end_date: date_now,
      signature_id,
    });

    return res.json(order);
  }
}

export default new FinishDeliveryController();
