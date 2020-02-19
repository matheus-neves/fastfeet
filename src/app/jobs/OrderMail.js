import Mail from '../../lib/Mail';

class OrderMail {
  /**
   * for each job, need a unique key
   */
  get key() {
    return 'OrderMail';
  }

  async handle({ data }) {
    const { deliveryman, order, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Você tem uma nova encomenda',
      template: 'delivery',
      context: {
        order,
        deliveryman,
        recipient,
      },
    });
  }
}

export default new OrderMail();
