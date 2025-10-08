import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const {
  AdminPaymentMethod,
  BankTransferDetail,
  EmailPaymentDetail,
  OtherPaymentDetail,
} = db;

const ALLOWED_FIELDS = ["payment_method", "note", "active_flag", "details"];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Payment method already exists for this admin" },
    };
  }
  if (error?.name === "SequelizeValidationError") {
    return {
      code: 400,
      body: {
        success: false,
        message: "Invalid data",
        details: error.errors?.map((e) => e.message),
      },
    };
  }
  return { code: 500, body: { success: false, message: "Server error" } };
};

// Add
export const addPaymentMethod = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const admin_id = req.user.id;
    const body = pickAllowed(req.body, ALLOWED_FIELDS);

    if (!body.payment_method)
      return res.status(400).json({ success: false, message: "Payment method is required" });

    const paymentMethod = await AdminPaymentMethod.create(
      { admin_id, payment_method: body.payment_method, note: body.note, active_flag: body.active_flag ?? true },
      { transaction }
    );

    if (body.payment_method === "bank_transfer" && body.details) {
      await BankTransferDetail.create(
        { payment_method_id: paymentMethod.id, ...body.details },
        { transaction }
      );
    } else if (["paypal", "payoneer", "skrill"].includes(body.payment_method) && body.details) {
      await EmailPaymentDetail.create(
        { payment_method_id: paymentMethod.id, email: body.details.email },
        { transaction }
      );
    } else if (body.payment_method === "other" && body.details) {
      await OtherPaymentDetail.create(
        { payment_method_id: paymentMethod.id, payment_method_name: body.details.payment_method_name },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).json({ success: true, message: "Payment method added successfully", data: paymentMethod });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get
export const getAllPaymentMethods = async (req, res) => {
  try {
    const admin_id = req.user.id;

    const payments = await AdminPaymentMethod.findAll({
      where: { admin_id },
      include: [
        { model: BankTransferDetail, as: "bank_transfer_detail" },
        { model: EmailPaymentDetail, as: "email_payment_detail" },
        { model: OtherPaymentDetail, as: "other_payment_detail" },
      ],
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Update
export const updatePaymentMethod = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const admin_id = req.user.id;
    const id = parseInt(req.params.id);
    const body = pickAllowed(req.body, ALLOWED_FIELDS);

    const existing = await AdminPaymentMethod.findOne({ where: { id, admin_id } });
    if (!existing)
      return res.status(404).json({ success: false, message: "Payment method not found" });

    await existing.update(
      { note: body.note ?? existing.note, active_flag: body.active_flag ?? existing.active_flag },
      { transaction }
    );

    if (existing.payment_method === "bank_transfer" && body.details) {
      await BankTransferDetail.update(body.details, { where: { payment_method_id: id }, transaction });
    } else if (["paypal", "payoneer", "skrill"].includes(existing.payment_method) && body.details) {
      await EmailPaymentDetail.update(
        { email: body.details.email },
        { where: { payment_method_id: id }, transaction }
      );
    } else if (existing.payment_method === "other" && body.details) {
      await OtherPaymentDetail.update(
        { payment_method_name: body.details.payment_method_name },
        { where: { payment_method_id: id }, transaction }
      );
    }

    await transaction.commit();
    res.json({ success: true, message: "Payment method updated successfully" });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Delete
export const deletePaymentMethod = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const admin_id = req.user.id;
    const id = parseInt(req.params.id);

    const payment = await AdminPaymentMethod.findOne({ where: { id, admin_id } });
    if (!payment)
      return res.status(404).json({ success: false, message: "Payment method not found" });

    await payment.destroy({ transaction });
    await transaction.commit();

    res.json({ success: true, message: "Payment method deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};