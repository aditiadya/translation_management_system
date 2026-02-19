import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const {
  AdminPaymentMethod,
  BankTransferDetail,
  EmailPaymentDetail,
  OtherPaymentDetail,
} = db;

const ALLOWED_FIELDS = ["payment_method", "note", "active_flag", "is_default", "details"];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: {
        success: false,
        message: "Payment method already exists for this admin",
      },
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
    const body = {
  ...pickAllowed(req.body, ALLOWED_FIELDS),
  is_default: req.body.is_default,
  details: req.body.details,
};
    console.log("Received body:", JSON.stringify(body, null, 2));
    const { is_default } = body;

    if (!body.payment_method)
      return res
        .status(400)
        .json({ success: false, message: "Payment method is required" });

    if (is_default) {
      await AdminPaymentMethod.update(
        { is_default: false },
        { where: { admin_id }, transaction }
      );
    }

    const paymentMethod = await AdminPaymentMethod.create(
      {
        admin_id,
        payment_method: body.payment_method,
        note: body.note,
        active_flag: body.active_flag ?? true,
        is_default: !!is_default,
      },
      { transaction },
    );

    if (body.payment_method === "bank_transfer" && body.details) {
      await BankTransferDetail.create(
        { payment_method_id: paymentMethod.id, ...body.details },
        { transaction },
      );
    } else if (
      ["paypal", "payoneer", "skrill"].includes(body.payment_method) &&
      body.details
    ) {
      await EmailPaymentDetail.create(
        {
          payment_method_id: paymentMethod.id,
          email: body.details.email,
          account_holder_name: body.details.account_holder_name ?? null,
        },
        { transaction },
      );
    } else if (body.payment_method === "other" && body.details) {
      await OtherPaymentDetail.create(
        {
          payment_method_id: paymentMethod.id,
          payment_method_name: body.details.payment_method_name,
        },
        { transaction },
      );
    }

    await transaction.commit();
    res.status(201).json({
      success: true,
      message: "Payment method added successfully",
      data: paymentMethod,
    });
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
    const body = {
  ...pickAllowed(req.body, ALLOWED_FIELDS),
  is_default: req.body.is_default,
  details: req.body.details,
};
    console.log("Received body:", JSON.stringify(body, null, 2));
    const { is_default } = body;

    const existing = await AdminPaymentMethod.findOne({
      where: { id, admin_id },
    });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });

    if (is_default) {
      await AdminPaymentMethod.update(
        { is_default: false },
        { where: { admin_id, id: { [db.Sequelize.Op.ne]: id } }, transaction }
      );
    }

    await existing.update(
      {
        note: body.note ?? existing.note,
        active_flag: body.active_flag ?? existing.active_flag,
        is_default: is_default !== undefined ? !!is_default : existing.is_default,
      },
      { transaction },
    );

    if (existing.payment_method === "bank_transfer" && body.details) {
      await BankTransferDetail.update(body.details, {
        where: { payment_method_id: id },
        transaction,
      });
    } else if (
      ["paypal", "payoneer", "skrill"].includes(existing.payment_method) &&
      body.details
    ) {
      await EmailPaymentDetail.update(
        {
          email: body.details.email,
          account_holder_name: body.details.account_holder_name ?? null,
        },
        { where: { payment_method_id: id }, transaction },
      );
    } else if (existing.payment_method === "other" && body.details) {
      await OtherPaymentDetail.update(
        { payment_method_name: body.details.payment_method_name },
        { where: { payment_method_id: id }, transaction },
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

    const payment = await AdminPaymentMethod.findOne({
      where: { id, admin_id },
    });
    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });

    if (payment.is_default) {
      const totalMethods = await AdminPaymentMethod.count({
        where: { admin_id },
        transaction,
      });

      if (totalMethods > 1) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete default payment method. Please set another payment method as default first.",
        });
      }
    }

    await payment.destroy({ transaction });
    await transaction.commit();

    res.json({ success: true, message: "Payment method deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};