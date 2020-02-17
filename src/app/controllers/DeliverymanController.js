import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
    });

    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .strict()
        .required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const verifyEmail = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (verifyEmail) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // review the code
    const { id, name, email } = await Deliveryman.create({
      ...req.body,
      avatar_id: 1,
    });

    return res.status(201).json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .strict()
        .required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: 'Id not registered in the system.' });
    }

    const { id, name, email } = await deliveryman.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: 'Id not registered in the system.' });
    }

    await deliveryman.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json();
  }
}

export default new DeliverymanController();
