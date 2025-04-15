export const healthcheck = (req, res) => {
    return res.status(200).json({ message: 'Healthcheck successful' });
};