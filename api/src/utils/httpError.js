const sendServerError = (res, error) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan internal server",
    data: null,
  });
};

const sendWriteError = (res, error) => {
  if (error?.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Data dengan detail tersebut sudah ada",
      data: null,
    });
  }

  return sendServerError(res, error);
};

module.exports = { sendServerError, sendWriteError };
