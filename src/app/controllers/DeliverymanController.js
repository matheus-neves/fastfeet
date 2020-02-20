import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
    });

    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
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

    const { name, email, avatar_id } = req.body;

    const deliveryman = await Deliveryman.create({
      name,
      email,
      avatar_id: avatar_id || null,
    });

    return res.status(201).json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
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

    if (req.body.avatar_id) {
      const checkAvatarExist = await File.findByPk(req.body.avatar_id);

      if (!checkAvatarExist) {
        return res.status(400).json({ error: 'Avatar_id not exist' });
      }
    }

    const { id, name, email, avatar_id } = await deliveryman.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: 'Id not registered in the system.' });
    }

    await deliveryman.destroy();

    return res.json();
  }
}

export default new DeliverymanController();
