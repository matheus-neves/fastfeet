import Mail from '../../lib/Mail';

class CancellationMail {
  /**
   * for each job, need a unique key
   */
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order, problem } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancellation',
      context: {
        order,
        problem,
      },
    });
  }
}

export default new CancellationMail();
