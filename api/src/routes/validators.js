const { body, param, query } = require("express-validator");

const email = body("email")
  .isString()
  .withMessage("Email wajib diisi")
  .bail()
  .trim()
  .isEmail()
  .withMessage("Email yang valid diperlukan")
  .normalizeEmail();

const password = body("password")
  .isString()
  .withMessage("Kata sandi wajib diisi")
  .bail()
  .isLength({ min: 8 })
  .withMessage("Kata sandi minimal 8 karakter");

// Register validation — name, email, password (min 8)
const register = [
  body("name")
    .isString()
    .withMessage("Nama wajib diisi")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Nama wajib diisi"),
  email,
  password,
];

// Login validation — email + password
const login = [
  email,
  body("password")
    .isString()
    .withMessage("Kata sandi wajib diisi")
    .bail()
    .notEmpty()
    .withMessage("Kata sandi wajib diisi"),
];

const CONTENT_CATEGORIES = [
  "Automotive",
  "Electronics",
  "Electrical",
  "Construction",
  "Machining & Welding",
];

const CONTENT_TYPES = ["article", "video"];

const CATEGORY_MESSAGE = `Kategori harus salah satu dari: ${CONTENT_CATEGORIES.join(
  ", "
)}`;

// Content creation validation — title, excerpt, category enum, type enum,
// body required when type === 'article', videoUrl required when type === 'video',
// coverUrl valid URL, videoUrl valid URL (required but must be a URL).
const contentFields = [
  body("title")
    .isString()
    .withMessage("Judul wajib diisi")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Judul wajib diisi"),
  body("excerpt")
    .isString()
    .withMessage("Ringkasan wajib diisi")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Ringkasan wajib diisi"),
  body("category")
    .isString()
    .withMessage("Kategori wajib diisi")
    .bail()
    .trim()
    .isIn(CONTENT_CATEGORIES)
    .withMessage(CATEGORY_MESSAGE),
  body("type")
    .isString()
    .withMessage("Tipe wajib diisi")
    .bail()
    .trim()
    .isIn(CONTENT_TYPES)
    .withMessage("Tipe harus article atau video"),
  body("body")
    .if(body("type").equals("article"))
    .isString()
    .withMessage("Konten artikel wajib memiliki isi")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Konten artikel wajib memiliki isi"),
  body("videoUrl")
    .if(body("type").equals("video"))
    .isString()
    .withMessage("Konten video wajib memiliki videoUrl")
    .bail()
    .trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("videoUrl harus berupa URL HTTP atau HTTPS yang valid"),
  body("coverUrl")
    .isString()
    .withMessage("coverUrl wajib diisi")
    .bail()
    .trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("coverUrl harus berupa URL HTTP atau HTTPS yang valid"),
  body("durationMinutes")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("Durasi harus bilangan bulat minimal 1")
    .bail()
    .toInt(),
  body("isStudentProject")
    .optional()
    .isBoolean()
    .withMessage("isStudentProject harus berupa boolean")
    .bail()
    .toBoolean(),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished harus berupa boolean")
    .bail()
    .toBoolean(),
];

// Content update validation — all fields optional, but must be valid when present.
const contentUpdate = [
  body("title")
    .optional()
    .isString()
    .withMessage("Judul harus berupa string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Judul tidak boleh kosong"),
  body("excerpt")
    .optional()
    .isString()
    .withMessage("Ringkasan harus berupa string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Ringkasan tidak boleh kosong"),
  body("category")
    .optional()
    .isString()
    .withMessage("Kategori harus berupa string")
    .bail()
    .trim()
    .isIn(CONTENT_CATEGORIES)
    .withMessage(CATEGORY_MESSAGE),
  body("type")
    .optional()
    .isString()
    .withMessage("Tipe harus berupa string")
    .bail()
    .trim()
    .isIn(CONTENT_TYPES)
    .withMessage("Tipe harus article atau video"),
  body("body")
    .if(
      (value, { req }) =>
        req.body.type === "article" || (!req.body.type && value !== undefined)
    )
    .optional()
    .isString()
    .withMessage("Isi harus berupa string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Isi tidak boleh kosong"),
  body("videoUrl")
    .if(
      (value, { req }) =>
        req.body.type === "video" || (!req.body.type && value !== undefined)
    )
    .optional()
    .isString()
    .withMessage("videoUrl harus berupa string")
    .bail()
    .trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("videoUrl harus berupa URL HTTP atau HTTPS yang valid"),
  body("coverUrl")
    .optional()
    .isString()
    .withMessage("coverUrl harus berupa string")
    .bail()
    .trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("coverUrl harus berupa URL HTTP atau HTTPS yang valid"),
  body("durationMinutes")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("Durasi harus bilangan bulat minimal 1")
    .bail()
    .toInt(),
  body("isStudentProject")
    .optional()
    .isBoolean()
    .withMessage("isStudentProject harus berupa boolean")
    .bail()
    .toBoolean(),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished harus berupa boolean")
    .bail()
    .toBoolean(),
];

const mongoId = (field) =>
  param(field)
    .isString()
    .withMessage(`${field} harus berupa id yang valid`)
    .bail()
    .isMongoId()
    .withMessage(`${field} harus berupa id yang valid`);

const contentQuery = [
  query("search")
    .optional()
    .isString()
    .withMessage("search harus berupa string")
    .bail()
    .trim(),
  query("category")
    .optional()
    .isString()
    .withMessage("category harus berupa string")
    .bail()
    .trim(),
  query("type")
    .optional()
    .isString()
    .withMessage("type harus berupa string")
    .bail()
    .trim(),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Halaman minimal 1")
    .bail()
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus antara 1 dan 100")
    .bail()
    .toInt(),
];

module.exports = {
  register,
  login,
  contentFields,
  contentUpdate,
  mongoId,
  contentQuery,
  CONTENT_CATEGORIES,
  CONTENT_TYPES,
};
