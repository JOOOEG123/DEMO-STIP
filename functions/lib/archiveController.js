"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allArchies = void 0;
// import {Request} from 'express';
const firebase_1 = require("./config/firebase");
const allArchies = async (req, res) => {
    // const alphabet = req.params.alphabet;
    try {
        // eslint-disable-next-line max-len
        await firebase_1.database.ref(`/persons/requestArchieve/persons`).once('value', (v) => {
            const o = v.val();
            console.log('New ', o);
            if (!o) {
                throw new Error('No data');
            }
            else {
                res.status(200).send({
                    message: 'allArchies',
                    status: 'success',
                    data: o,
                });
            }
        });
    }
    catch (error) {
        res.status(500).send({
            message: 'allArchies',
            status: 'error',
            data: error,
        });
    }
};
exports.allArchies = allArchies;
//# sourceMappingURL=archiveController.js.map