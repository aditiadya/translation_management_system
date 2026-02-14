import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const {
  VendorDetails,
  VendorPaymentMethod,
  VendorBankTransferDetail,
  VendorEmailPaymentDetail,
  VendorOtherPaymentDetail,
} = db;

const ALLOWED_FIELDS = [
  "vendor_id",
  "payment_method",
  "note",
  "active_flag",
  "is_default",
  "details",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Payment method already exists for this vendor" },
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
export const addVendorPaymentMethod = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const body = pickAllowed(req.body, ALLOWED_FIELDS);
    const { vendor_id, payment_method, is_default } = body;

    if (!vendor_id)
      return res.status(400).json({ success: false, message: "Vendor ID is required" });
    if (!payment_method)
      return res.status(400).json({ success: false, message: "Payment method is required" });

    const vendor = await VendorDetails.findOne({ where: { id: vendor_id, admin_id: adminId } });
    if (!vendor)
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this vendor",
      });

    // If setting as default, unset all other defaults for this vendor
    if (is_default) {
      await VendorPaymentMethod.update(
        { is_default: false },
        { where: { vendor_id }, transaction }
      );
    }

    const payment = await VendorPaymentMethod.create(
      {
        vendor_id,
        payment_method,
        note: body.note || null,
        active_flag: body.active_flag ?? true,
        is_default: !!is_default,
      },
      { transaction }
    );

    let createdDetails = null;

    if (payment_method === "bank_transfer" && body.details) {
      createdDetails = await VendorBankTransferDetail.create(
        { payment_method_id: payment.id, ...body.details },
        { transaction }
      );
    } else if (["paypal", "payoneer", "skrill"].includes(payment_method) && body.details) {
      createdDetails = await VendorEmailPaymentDetail.create(
        { payment_method_id: payment.id, email: body.details.email },
        { transaction }
      );
    } else if (payment_method === "other" && body.details) {
      createdDetails = await VendorOtherPaymentDetail.create(
        {
          payment_method_id: payment.id,
          payment_method_name: body.details.payment_method_name,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Fetch complete data with associations
    const completePayment = await VendorPaymentMethod.findByPk(payment.id, {
      include: [
        { model: VendorBankTransferDetail, as: "bank_transfer_detail" },
        { model: VendorEmailPaymentDetail, as: "email_payment_detail" },
        { model: VendorOtherPaymentDetail, as: "other_payment_detail" },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Vendor payment method added successfully",
      data: completePayment,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get
export const getVendorPaymentMethods = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { vendor_id } = req.params;

    if (!vendor_id)
      return res.status(400).json({ success: false, message: "Vendor ID is required" });

    const vendor = await VendorDetails.findOne({ where: { id: vendor_id, admin_id: adminId } });
    if (!vendor)
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this vendor's payment methods",
      });

    const payments = await VendorPaymentMethod.findAll({
      where: { vendor_id },
      include: [
        { model: VendorBankTransferDetail, as: "bank_transfer_detail" },
        { model: VendorEmailPaymentDetail, as: "email_payment_detail" },
        { model: VendorOtherPaymentDetail, as: "other_payment_detail" },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.log(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Update
export const updateVendorPaymentMethod = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const body = pickAllowed(req.body, ALLOWED_FIELDS);
    const { note, active_flag, is_default, details } = body;

    const existing = await VendorPaymentMethod.findOne({
      where: { id },
      transaction,
    });
    if (!existing)
      return res.status(404).json({ success: false, message: "Payment method not found" });

    const vendor = await VendorDetails.findOne({
      where: { id: existing.vendor_id },
      transaction,
    });
    if (!vendor)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    if (vendor.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this vendor's payment methods",
      });
    }

    // If setting as default, unset all other defaults for this vendor (excluding current one)
    if (is_default) {
      await VendorPaymentMethod.update(
        { is_default: false },
        { 
          where: { 
            vendor_id: vendor.id, 
            id: { [db.Sequelize.Op.ne]: id } 
          }, 
          transaction 
        }
      );
    }

    await existing.update(
      {
        note: note !== undefined ? note : existing.note,
        active_flag: active_flag !== undefined ? active_flag : existing.active_flag,
        is_default: is_default !== undefined ? !!is_default : existing.is_default,
      },
      { transaction }
    );

    if (existing.payment_method === "bank_transfer" && details) {
      await VendorBankTransferDetail.update(details, {
        where: { payment_method_id: id },
        transaction,
      });
    } else if (["paypal", "payoneer", "skrill"].includes(existing.payment_method) && details) {
      await VendorEmailPaymentDetail.update(
        { email: details.email },
        { where: { payment_method_id: id }, transaction }
      );
    } else if (existing.payment_method === "other" && details) {
      await VendorOtherPaymentDetail.update(
        { payment_method_name: details.payment_method_name },
        { where: { payment_method_id: id }, transaction }
      );
    }

    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: "Vendor payment method updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Delete
export const deleteVendorPaymentMethod = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const payment = await VendorPaymentMethod.findOne({
      where: { id },
      transaction,
    });

    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });

    const vendor = await VendorDetails.findOne({
      where: { id: payment.vendor_id },
      transaction,
    });

    if (!vendor)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    if (vendor.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this vendor's payment method",
      });
    }

    // Check if this is the default payment method
    if (payment.is_default) {
      // Count total payment methods for this vendor
      const totalMethods = await VendorPaymentMethod.count({
        where: { vendor_id: payment.vendor_id },
        transaction,
      });

      // If there are other methods, require user to change default first
      if (totalMethods > 1) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Cannot delete default payment method. Please set another payment method as default first.",
        });
      }
    }

    await payment.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Vendor payment method deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};
