function requireAdminKey(req) {
  const clientKey = req.headers['x-admin-key'];
  const serverKey = process.env.ADMIN_KEY;
  return !!serverKey && clientKey === serverKey;
}

module.exports = { requireAdminKey };