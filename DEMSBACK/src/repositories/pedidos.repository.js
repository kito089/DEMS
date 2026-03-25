const axios = require('axios');

const BASE_URL = 'http://localhost:4000/pedidos';

exports.getAll = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};

exports.getById = async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
};

exports.create = async (data) => {
    const res = await axios.post(BASE_URL, data);
    return res.data;
};

exports.update = async (id, data) => {
    const res = await axios.put(`${BASE_URL}/${id}`, data);
    return res.data;
};

exports.remove = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
};