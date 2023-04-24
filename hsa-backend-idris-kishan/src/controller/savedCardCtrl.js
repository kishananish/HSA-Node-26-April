'use strict';

import formatResponse from '../../utils/formatResponse';
import Cards from '../models/SavedCards';

/**
 * API to add the card
 * @param {*} req 
 * @param {*} res 
 */
export const addCard = async (req, res) => {
    req.body.user_id = req.user;
    console.log('data :', req.body);
    const card = await Cards.find({ card_number: req.body.card_number });
    if (card && card.length) {
        let error = new Error('Card already exist!');
        error.name = 'dataExist';
        return formatResponse(res, error);
    }
    const result = await Cards.create(req.body);
    result.statusCode = 200;
    formatResponse(res, result);
};

/**
 * API to update the saved card
 * @param {*} req 
 * @param {*} res 
 */
export const updateCard = async (req, res) => {
    req.body.user_id = req.user;
    const card = await Cards.findById(req.params.id);
    if (!card) {
        let error = new Error('Card not found!');
        error.name = 'NotFound';
        return formatResponse(res, error);
    }
    card.card_number = req.body.card_number || card.card_number;
    card.expiry_date = req.body.expiry_date || card.expiry_date;
    // card.expiry_year = req.body.expiry_year || card.expiry_year;
    card.cvv = req.body.cvv || card.cvv;
    card.card_name = req.body.card_name || card.card_name;
    card.bank_name = req.body.bank_name || card.bank_name;

    // If the user selects the card as DEFAULT card
    if (req.query.is_default == 'true') {

        card.is_default = true;
        await card.save();
        await Cards.updateMany({ _id: { $ne: card } }, { $set: { is_default: false } }, { multi: true });
        card.message = 'Card updated Successfully!';
        return formatResponse(res, card);
    }

    await card.save();
    card.message = 'Card updated Successfully!';
    return formatResponse(res, card);
};

/**
 * API to delete the saved card by its id
 * @param {*} req 
 * @param {*} res 
 */
export const deleteCard = async (req, res) => {
    let card = req.params.id;
    const result = await Cards.remove({ _id: card });
    if (result.n == 0) {
        let error = new Error('Card not found!');
        error.name = 'NotFound';
        return formatResponse(res, error);
    }
    result.message = 'Card Deleted';
    return formatResponse(res, result);
};

/**
 * API to fetch all the saved cards
 * @param {*} req 
 * @param {*} res 
 */
export const fetchCards = async (req, res) => {
    const user = req.user;
    const result = await Cards.find({ user_id: user });
    return formatResponse(res, result);
};