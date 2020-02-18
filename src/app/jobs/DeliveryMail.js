import Mail from '../../lib/Mail';

class DeliveryMail {
  /**
   * for each job, need a unique key
   */
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Você tem uma nova encomenda',
      template: 'delivery',
      context: {
        delivery,
        deliveryman,
        recipient,
      },
    });
  }
}

export default new DeliveryMail();
